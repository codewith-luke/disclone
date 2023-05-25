package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/go-playground/validator/v10"
	"github.com/spf13/viper"
	"github.com/unrolled/render"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

const (
	ENV_CLERK_SECRET = "CLERK_SECRET"
)

const (
	CTX_USER_SESSION = "user_session"
)

type Validator interface {
	Struct(any) error
}

func Validate(r *http.Request, validate Validator, target any) error {
	if r.Body == nil {
		return fmt.Errorf("request body is empty")
	}

	err := json.NewDecoder(r.Body).Decode(&target)

	if err != nil {
		return err
	}

	err = validate.Struct(target)

	if err != nil {
		return err
	}

	return nil
}

type Renderer interface {
	JSON(io.Writer, int, any) error
}

type UserSession struct {
	UserID   string
	Provider string
}

type Server struct {
	Validate Validator
	Renderer Renderer
	Router   *chi.Mux
	DB       *DB
	Clerk    *AuthClient
}

type ErrorRes struct {
	Message string `json:"message"`
}

func main() {
	bootstrapEnvConfig()
	s := CreateServer()
	s.MountHandlers()
	defer s.DB.Close()

	http.ListenAndServe(":8000", s.Router)
}

func bootstrapEnvConfig() {
	viper.AutomaticEnv()
	viper.SetConfigName(".server.env")
	viper.SetConfigType("env")
	viper.AddConfigPath("../../")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Println("InternalError, could not locate .server.env file", err)
		} else {
			log.Println("InternalError loading .server.env file", err)
		}
	}
}

func CreateServer() *Server {
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*", "tauri://localhost"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))
	r.Use(middleware.Heartbeat("/"))

	var Validate = validator.New()
	var Renderer = render.New()
	var db = NewDB(context.Background())

	secret := GetENVKey(ENV_CLERK_SECRET)
	clerkClient := NewAuthClient(secret)

	return &Server{
		Validate: Validate,
		Renderer: Renderer,
		Router:   r,
		DB:       db,
		Clerk:    clerkClient,
	}
}

func (s *Server) MountHandlers() {
	userProvider := NewUserProvider(UserProviderConfig{
		Validate: s.Validate,
		Renderer: s.Renderer,
		DB:       s.DB,
	})

	webhookRouter := chi.NewRouter()
	webhookRouter.Group(func(r chi.Router) {
		createPath := fmt.Sprintf("/user/{provider:%s|%s}/create", PROVIDER_CLERK)
		r.Post(createPath, func(w http.ResponseWriter, r *http.Request) {
			provider := chi.URLParam(r, "provider")

			response, err := userProvider.CreateNewUser(r, provider)

			if err != nil {
				s.Renderer.JSON(w, http.StatusOK, FormatErrorRes(err))
				return
			}

			s.Renderer.JSON(w, http.StatusOK, response)
			return
		})
	})

	tr := NewTicketRetention()
	chatRouter := NewChat(ChatServerConfig{
		Server:        s,
		TicketManager: tr,
	})

	s.Router.Mount("/webhooks", webhookRouter)
	s.Router.Mount("/chat", chatRouter.Router)
}

func WithAuth(next http.HandlerFunc, cc *AuthClient) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionToken := r.Header.Get("Authorization")
		sessionToken = strings.TrimPrefix(sessionToken, "Bearer ")
		sessClaims, err := cc.VerifyToken(PROVIDER_CLERK, sessionToken)

		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}

		ctx := context.WithValue(r.Context(), CTX_USER_SESSION, sessClaims)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
