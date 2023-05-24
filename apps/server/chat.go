package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/go-chi/chi/v5"
	"log"
	"net/http"
	"sync"
	"time"

	"golang.org/x/time/rate"
	"nhooyr.io/websocket"
)

const (
	MESSAGE_TYPE_MESSAGE = "message"
)

type Message struct {
	Type      string `json:"type"`
	ChannelID string `json:"channelID"`
	SenderID  string `json:"senderID"`
	Content   string `json:"content"`
}

type TicketManager interface {
	Validate(key string) bool
	Add(userID string) (string, error)
}

type chatServer struct {
	// subscriberMessageBuffer controls the max number
	// of messages that can be queued for a subscriber
	// before it is kicked.
	//
	// Defaults to 16.
	subscriberMessageBuffer int

	// publishLimiter controls the rate limit applied to the publish endpoint.
	//
	// Defaults to one publish every 100ms with a burst of 8.
	publishLimiter *rate.Limiter

	// logf controls where logs are sent.
	// Defaults to log.Printf.
	logf func(f string, v ...interface{})

	// Router routes the various endpoints to the appropriate handler.
	Router *chi.Mux

	subscribersMu sync.Mutex
	subscribers   map[*subscriber]struct{}

	ticketManager TicketManager
	Validate      Validator
}

type subscriber struct {
	msgs      chan []byte
	closeSlow func()
}

func NewChat(s *Server, tr *TicketRetention) *chatServer {
	r := chi.NewRouter()

	cs := &chatServer{
		Router:                  r,
		subscriberMessageBuffer: 16,
		logf:                    log.Printf,
		subscribers:             make(map[*subscriber]struct{}),
		Validate:                s.Validate,
		publishLimiter:          rate.NewLimiter(rate.Every(time.Millisecond*100), 8),
		ticketManager:           tr,
	}

	cs.Router.Post("/login", WithAuth(cs.login, s.clerk))
	cs.Router.Get("/subscribe", cs.subscribeHandler)
	cs.Router.Post("/publish", cs.publishHandler)

	return cs
}

func (cs *chatServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	cs.Router.ServeHTTP(w, r)
}

func (cs *chatServer) login(w http.ResponseWriter, r *http.Request) {
	sessionClaims := r.Context().Value("session").(UserSession)
	ticket, err := cs.ticketManager.Add(sessionClaims.ID)

	if err != nil {
		http.Error(w, "server error", http.StatusInternalServerError)
		return
	}

	cookie := http.Cookie{
		Name:     "__chat_ticket",
		Value:    ticket,
		MaxAge:   10,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, &cookie)
	w.Write([]byte("cookie set!"))
}

func (cs *chatServer) subscribeHandler(w http.ResponseWriter, r *http.Request) {
	ticket, err := r.Cookie("__chat_ticket")

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

	if !cs.ticketManager.Validate(ticket.Value) {
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

	err = cs.subscribe(r.Context(), c)

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

func (cs *chatServer) publishHandler(w http.ResponseWriter, r *http.Request) {
	input := Message{}
	err := Validate(r, cs.Validate, &input)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	cs.publish([]byte(input.Content))
	w.WriteHeader(http.StatusAccepted)
}

func (cs *chatServer) subscribe(ctx context.Context, c *websocket.Conn) error {
	ctx = c.CloseRead(ctx)

	s := &subscriber{
		msgs: make(chan []byte, cs.subscriberMessageBuffer),
		closeSlow: func() {
			c.Close(websocket.StatusPolicyViolation, "connection too slow to keep up with messages")
		},
	}

	cs.addSubscriber(s)
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

func (cs *chatServer) publish(msg []byte) {
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

func (cs *chatServer) addSubscriber(s *subscriber) {
	cs.subscribersMu.Lock()
	cs.subscribers[s] = struct{}{}
	cs.subscribersMu.Unlock()
}

func (cs *chatServer) deleteSubscriber(s *subscriber) {
	cs.subscribersMu.Lock()
	delete(cs.subscribers, s)
	cs.subscribersMu.Unlock()
}

func writeWithTimeout(ctx context.Context, timeout time.Duration, c *websocket.Conn, msg []byte) error {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	return c.Write(ctx, websocket.MessageText, msg)
}
