package main

import (
	"flag"
	"fmt"
	"github.com/codewith-luke/disclone/apps/proxy/api"
	disclone_logger "github.com/codewith-luke/disclone/packages/disclone-logger"
	omware "github.com/deepmap/oapi-codegen/pkg/middleware"
	"github.com/go-openapi/runtime/middleware"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"log"
	"log/slog"
	"net"
	"os"
)

type EnvKeys string

const (
	ENV           EnvKeys = "ENV"
	SERVICE_NAME  EnvKeys = "SERVICE_NAME"
	PORT          EnvKeys = "PORT"
	REGISTRY_HOST EnvKeys = "REGISTRY_HOST"
	REGISTRY_PORT EnvKeys = "REGISTRY_PORT"
)

func main() {
	loggerOpts := disclone_logger.PrettyHandlerOptions{
		SlogOpts: slog.HandlerOptions{
			Level: slog.LevelDebug,
		},
	}
	handler := disclone_logger.NewPrettyHandler(os.Stdout, loggerOpts)
	logger := slog.New(handler)

	loadEnvVariables(logger, ENV)

	portNum := os.Getenv(string(PORT))

	port := flag.String("port", portNum, "Port for test HTTP server")
	flag.Parse()

	swagger, err := api.GetSwagger()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading swagger spec\n: %s", err)
		os.Exit(1)
	}

	// Clear out the servers array in the swagger spec, that skips validating
	// that server names match. We don't know how this thing will be run.
	swagger.Servers = nil

	// Create an instance of our handler which satisfies the generated interface
	cache, err := NewRegistryCache()

	if err != nil {
		logger.Error("Error creating registry cache: " + err.Error())
		os.Exit(1)
	}

	srv := Server{
		RegistryCache: cache,
	}

	// This is how you set up a basic Echo router
	e := echo.New()
	// Log all requests
	//e.Use(echomiddleware.Logger())
	// Use our validation middleware to check all requests against the

	e.Use(omware.OapiRequestValidator(swagger))

	// We now register our srv above as the handler for the interface
	api.RegisterHandlers(e, &srv)

	opts := middleware.SwaggerUIOpts{SpecURL: "proxy-api.yaml"}
	sh := middleware.SwaggerUI(opts, nil)
	//opts := middleware.RedocOpts{SpecURL: "proxy-api.yaml", Path: "doc"}
	// TODO: Investigate custom styping using this https://redocly.com/docs/redoc/quickstart/
	//openAPIDoc := middleware.Redoc(opts, nil)

	e.File("/proxy-api.yaml", "./proxy-api.yaml")
	//e.GET("/doc", echo.WrapHandler(sh))
	e.GET("/docs", echo.WrapHandler(sh))

	// And we serve HTTP until the world ends.
	e.Logger.Fatal(e.Start(net.JoinHostPort("0.0.0.0", *port)))
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
