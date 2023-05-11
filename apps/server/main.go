package main

import (
	"context"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
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
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath("../../")

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Println("InternalError, could not locate .env file", err)
		} else {
			log.Println("InternalError loading .env file", err)
		}
	}
}

func CreateServer() *Server {
	r := chi.NewRouter()

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

	s.Router.Mount("/webhooks", webhookRouter)
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

		user, err := clerk.client.Users().Read(sessClaims.Claims.Subject)

		if err != nil {
			panic(err)
		}

		fmt.Println(user)

		next.ServeHTTP(w, r)
	})
}
