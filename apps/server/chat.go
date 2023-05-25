package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/spf13/viper"
	"log"
	"net/http"
	"sync"
	"time"

	"golang.org/x/time/rate"
	"nhooyr.io/websocket"
)

const (
	MESSAGE_TYPE_MESSAGE = "message"
	COOKE_CHAT_TICKET    = "__chat_ticket"
)

type Message struct {
	Type      string `json:"type"`
	ChannelID int    `json:"channelID"`
	SenderID  string `json:"senderID"`
	Content   string `json:"content"`
}

type TicketManager interface {
	Validate(key string) (*TicketClaims, bool)
	Add(userID string) (string, error)
}

type ChatServer struct {
	// subscriberMessageBuffer controls the max number
	// of messages that can be queued for a subscriber
	// before it is kicked.
	//
	// Defaults to 16.
	subscriberMessageBuffer int

	publishLimiter *rate.Limiter

	logf func(f string, v ...interface{})

	Router *chi.Mux

	subscribersMu sync.Mutex
	subscribers   map[*subscriber]struct{}

	ticketManager TicketManager
	Validate      Validator
}

type subscriber struct {
	userID    string
	msgs      chan []byte
	closeSlow func()
}

type ChatServerConfig struct {
	Server        *Server
	TicketManager *TicketRetention
}

func NewChat(config ChatServerConfig) *ChatServer {
	r := chi.NewRouter()

	cs := &ChatServer{
		Router:                  r,
		subscriberMessageBuffer: 16,
		logf:                    log.Printf,
		subscribers:             make(map[*subscriber]struct{}),
		Validate:                config.Server.Validate,
		publishLimiter:          rate.NewLimiter(rate.Every(time.Millisecond*100), 8),
		ticketManager:           config.TicketManager,
	}

	cs.Router.Post("/ticket", WithAuth(cs.createTicket, config.Server.Clerk))
	cs.Router.Get("/subscribe", cs.subscribeHandler)
	cs.Router.Post("/publish", cs.publishHandler)

	return cs
}

func (cs *ChatServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	cs.Router.ServeHTTP(w, r)
}

func (cs *ChatServer) createTicket(w http.ResponseWriter, r *http.Request) {
	sessionClaims := r.Context().Value(CTX_USER_SESSION).(UserSession)
	ticket, err := cs.ticketManager.Add(sessionClaims.UserID)

	if err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}

	env, ok := viper.Get("ENV").(string)

	if !ok {
		err := fmt.Errorf("%s not found", "ENV")
		log.Fatal(err)
	}

	cookie := http.Cookie{
		Name:     COOKE_CHAT_TICKET,
		Value:    ticket,
		MaxAge:   10,
		HttpOnly: true,
		Secure:   env == "production",
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, &cookie)
	w.Write([]byte("cookie set!"))
}

func (cs *ChatServer) subscribeHandler(w http.ResponseWriter, r *http.Request) {
	ticket, err := r.Cookie(COOKE_CHAT_TICKET)

	if err != nil {
		switch {
		case errors.Is(err, http.ErrNoCookie):
			fmt.Println("cookie not found")
			http.Error(w, "cookie not found", http.StatusBadRequest)
		default:
			log.Println(err)
			http.Error(w, "server error", http.StatusInternalServerError)
		}
		return
	}

	ticketClaims, isValid := cs.ticketManager.Validate(ticket.Value)

	if !isValid {
		http.Error(w, "invalid ticket", http.StatusBadRequest)
		return
	}

	c, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})

	if err != nil {
		cs.logf("%v", err)
		return
	}

	defer c.Close(websocket.StatusInternalError, "")

	subject, err := ticketClaims.MapClaims.GetSubject()

	if err != nil {
		cs.logf("%v", err)
		return
	}

	// TODO: make a better way to add the session to the context
	ctx := context.WithValue(r.Context(), CTX_USER_SESSION, UserSession{
		UserID:   subject,
		Provider: "",
	})

	err = cs.subscribe(ctx, c)

	if errors.Is(err, context.Canceled) {
		return
	}

	if websocket.CloseStatus(err) == websocket.StatusNormalClosure ||
		websocket.CloseStatus(err) == websocket.StatusGoingAway {
		return
	}

	if err != nil {
		cs.logf("%v", err)
		return
	}
}

func (cs *ChatServer) publishHandler(w http.ResponseWriter, r *http.Request) {
	input := Message{}
	err := Validate(r, cs.Validate, &input)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// TODO: Validate that the user is in fact in the room
	switch input.Type {
	case MESSAGE_TYPE_MESSAGE:
		msg := fmt.Sprintf("%s: %s", input.SenderID, input.Content)
		cs.publish([]byte(msg))
		break
	default:
		http.Error(w, "invalid message type", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}

func (cs *ChatServer) subscribe(ctx context.Context, c *websocket.Conn) error {
	sessionClaims := ctx.Value(CTX_USER_SESSION).(UserSession)
	ctx = c.CloseRead(ctx)

	s := &subscriber{
		userID: sessionClaims.UserID,
		msgs:   make(chan []byte, cs.subscriberMessageBuffer),
		closeSlow: func() {
			c.Close(websocket.StatusPolicyViolation, "connection too slow to keep up with messages")
		},
	}

	room := NewRoom()
	cs.addSubscriber(s, room)
	defer cs.deleteSubscriber(s)

	for {
		select {
		case msg := <-s.msgs:
			err := writeWithTimeout(ctx, time.Second*5, c, msg)

			if err != nil {
				return err
			}
		case <-ctx.Done():
			return ctx.Err()
		}
	}
}

func (cs *ChatServer) publish(msg []byte) {
	cs.subscribersMu.Lock()

	defer cs.subscribersMu.Unlock()

	cs.publishLimiter.Wait(context.Background())

	for s := range cs.subscribers {
		select {
		case s.msgs <- msg:
		default:
			go s.closeSlow()
		}
	}
}

func (cs *ChatServer) addSubscriber(s *subscriber, room *Room) {
	cs.subscribersMu.Lock()
	cs.subscribers[s] = struct{}{}
	room.AddUser(s.userID)
	cs.subscribersMu.Unlock()
}

func (cs *ChatServer) deleteSubscriber(s *subscriber) {
	cs.subscribersMu.Lock()
	delete(cs.subscribers, s)
	cs.subscribersMu.Unlock()
}

func writeWithTimeout(ctx context.Context, timeout time.Duration, c *websocket.Conn, msg []byte) error {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	return c.Write(ctx, websocket.MessageText, msg)
}
