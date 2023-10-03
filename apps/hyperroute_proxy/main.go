package main

import (
	"flag"
	"fmt"
	"github.com/codewith-luke/disclone/apps/proxy/api"
	"github.com/codewith-luke/plog"
	omware "github.com/deepmap/oapi-codegen/pkg/middleware"
	"github.com/go-openapi/runtime/middleware"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	echomiddleware "github.com/labstack/echo/v4/middleware"
	"log"
	"log/slog"
	"net"
	"os"
)

type EnvKeys string

const (
	ENV  EnvKeys = "ENV"
	PORT EnvKeys = "PORT"
)

func main() {
	loggerOpts := plog.PrettyHandlerOptions{
		SlogOpts: slog.HandlerOptions{
			Level: slog.LevelDebug,
		},
	}
	handler := plog.NewPrettyHandler(os.Stdout, loggerOpts)
	logger := slog.New(handler)

	loadEnvVariables(logger, ENV)

	portNum := os.Getenv(string(PORT))

	port := flag.String("port", portNum, "Port for test HTTP server")
	flag.Parse()

	oAPI, err := api.GetSwagger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading oAPI spec\n: %s", err)
		os.Exit(1)
	}

	// Clear out the servers array in the oAPI spec, that skips validating
	// that server names match. We don't know how this thing will be run.
	oAPI.Servers = nil

	srv := Server{}

	// This is how you set up a basic Echo router
	e := echo.New()

	// Log all requests
	e.Use(echomiddleware.Logger())

	// Use our validation middleware to check all requests against the
	e.Use(omware.OapiRequestValidator(oAPI))

	wrapper := api.ServerInterfaceWrapper{
		Handler: &srv,
	}

	e.GET("/doc", srv.GetDoc)
	e.GET("/docs", srv.GetDocs)

	registerBaseHandlers(e, wrapper)
	registerGroupHandlers(e, wrapper)
	registerProfileHandlers(e, wrapper)

	swaggerOpts := middleware.SwaggerUIOpts{SpecURL: "proxy-api.yaml"}
	sh := middleware.SwaggerUI(swaggerOpts, nil)
	oAPIOpts := middleware.RedocOpts{SpecURL: "proxy-api.yaml", Path: "doc"}
	// TODO: Investigate custom styping using this https://redocly.com/docs/redoc/quickstart/
	openAPIDoc := middleware.Redoc(oAPIOpts, nil)

	e.File("/proxy-api.yaml", "./proxy-api.yaml")
	e.GET("/doc", echo.WrapHandler(openAPIDoc))
	e.GET("/docs", echo.WrapHandler(sh))

	// And we serve HTTP until the world ends.
	e.Logger.Fatal(e.Start(net.JoinHostPort("0.0.0.0", *port)))
}

func registerBaseHandlers(e *echo.Echo, srv api.ServerInterfaceWrapper) {
	e.POST("/login", srv.Login)
	e.POST("/logout", srv.Logout)
	e.POST("/register", srv.Register)
	e.GET("/proxy-api.yaml", srv.GetProxy)
}

func registerGroupHandlers(e *echo.Echo, srv api.ServerInterfaceWrapper) {
	g := e.Group("/groups")

	g.GET("", srv.GetGroups)
	g.POST("", srv.CreateGroup)
	g.GET("/:id", srv.GetGroup)
	g.GET("/:id/members", srv.GetGroupMembers)
	g.GET("/:id/messages", srv.GetGroupMessages)
	g.POST("/:id/messages", srv.SendMessageToGroup)
}

func registerProfileHandlers(e *echo.Echo, srv api.ServerInterfaceWrapper) {
	p := e.Group("/profile")

	p.GET("", srv.GetProfile)
	p.PATCH("", srv.UpdateProfile)
	p.GET("/settings", srv.GetSettings)
	p.PATCH("/settings", srv.UpdateSettings)
}

func loadEnvVariables(logger *slog.Logger, key EnvKeys) {
	env := os.Getenv(string(key))

	if len(env) == 0 {
		env = "development"
	}

	envFile := fmt.Sprintf(".%s.env", env)

	err := godotenv.Load(envFile)

	if err != nil {
		log.Fatalf("Error loading %s file", envFile)
	}

	logger.Info("Loaded environment variables from: " + envFile)
}
