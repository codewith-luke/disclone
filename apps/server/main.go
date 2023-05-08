package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-playground/validator/v10"
	"github.com/unrolled/render"
	"io"
	"net/http"
	"time"
)

type Validator interface {
	Struct(any) error
}

type Renderer interface {
	JSON(io.Writer, int, any) error
}

type RequestConfig struct {
	Validate Validator
	Renderer Renderer
	Request  *http.Request
	Writer   io.Writer
}

type ClerkWebhookInput struct {
	Object string `json:"object" validate:"required"`
	Type   string `json:"type" validate:"required"`
	Data   any    `json:"data"`
}

type Server struct {
	Validate Validator
	Renderer Renderer
	Router   *chi.Mux
}

const (
	PROVIDER_CLERK = "clerk"
	PROVIDER_AUTHO = "autho"
)

func main() {
	s := CreateServer()
	s.MountHandlers()

	http.ListenAndServe(":8000", s.Router)
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

	return &Server{
		Validate: Validate,
		Renderer: Renderer,
		Router:   r,
	}
}

func (s *Server) MountHandlers() {
	webhookRouter := chi.NewRouter()
	webhookRouter.Group(func(r chi.Router) {
		createPath := fmt.Sprintf("/user/{provider:%s|%s}/create", PROVIDER_CLERK, PROVIDER_AUTHO)

		r.Post(createPath, func(w http.ResponseWriter, r *http.Request) {
			provider := chi.URLParam(r, "provider")
			rc := &RequestConfig{
				Validate: s.Validate,
				Renderer: s.Renderer,
				Request:  r,
				Writer:   w,
			}

			err := RunUserCreate(rc, provider)

			if err != nil {
				s.Renderer.JSON(w, http.StatusInternalServerError, err)
			}
		})
	})

	s.Router.Mount("/webhooks", webhookRouter)
}

func RunUserCreate(rc *RequestConfig, provider string) error {
	switch provider {
	case PROVIDER_CLERK:
		input := ClerkWebhookInput{}
		err := ValidateInput(rc, &input)

		if err != nil {
			return rc.Renderer.JSON(rc.Writer, http.StatusOK, FormatErrorRes(err))
		}

		return rc.Renderer.JSON(rc.Writer, http.StatusOK, input)
	default:
		response := map[string]string{
			"message": "provider not found or not implemented yet",
		}

		return rc.Renderer.JSON(rc.Writer, http.StatusOK, response)
	}
}

func ValidateInput(rc *RequestConfig, input any) error {
	if rc.Request.Body == nil {
		return fmt.Errorf("request body is empty")
	}

	err := json.NewDecoder(rc.Request.Body).Decode(&input)

	if err != nil {
		return err
	}

	err = rc.Validate.Struct(input)

	if err != nil {
		return err
	}

	return nil
}

type ErrorRes struct {
	Message string `json:"message"`
}

func FormatErrorRes(err error) ErrorRes {
	return ErrorRes{
		Message: err.Error(),
	}
}
