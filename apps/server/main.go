package main

import (
	"context"
	"errors"
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

type Validator interface {
	Struct(any) error
}

type Renderer interface {
	JSON(io.Writer, int, any) error
}

type Server struct {
	Validate Validator
	Renderer Renderer
	Router   *chi.Mux
	DB       *DB
	clerk    *ClerkClient
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
		AllowedOrigins:   []string{"https://*", "http://*"},
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

	secret := GetENVKey("CLERK_SECRET")
	clerkClient := NewClerkClient(secret)

	return &Server{
		Validate: Validate,
		Renderer: Renderer,
		Router:   r,
		DB:       db,
		clerk:    clerkClient,
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
		createPath := fmt.Sprintf("/user/{provider:%s|%s}/create", PROVIDER_CLERK, PROVIDER_AUTHO)

		r.Get("/", WithAuth(func(w http.ResponseWriter, r *http.Request) {
			s.Renderer.JSON(w, http.StatusOK, map[string]string{"hello": "world"})
		}, s.clerk))

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

	chatRouter := newChat(s)

	s.Router.Mount("/webhooks", webhookRouter)
	s.Router.Mount("/chat", chatRouter.Router)

	s.Router.Get("/set", func(w http.ResponseWriter, r *http.Request) {
		cookie := http.Cookie{
			Name:     "exampleCookie",
			Value:    "Hello world!",
			MaxAge:   3600,
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteLaxMode,
		}
		http.SetCookie(w, &cookie)
		w.Write([]byte("cookie set!"))
	})

	s.Router.Get("/get", func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("exampleCookie")
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
		fmt.Println(cookie.Value)
	})
}

func WithAuth(next http.HandlerFunc, clerk *ClerkClient) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sessionToken := r.Header.Get("Authorization")
		sessionToken = strings.TrimPrefix(sessionToken, "Bearer ")

		sessClaims, err := clerk.client.VerifyToken(sessionToken)

		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}

		_, err = clerk.client.Users().Read(sessClaims.Claims.Subject)

		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}

		ctx := context.WithValue(r.Context(), "session", sessClaims.Claims)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
