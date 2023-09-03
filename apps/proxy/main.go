package main

import (
	"flag"
	"fmt"
	"github.com/codewith-luke/disclone/apps/proxy/api"
	omware "github.com/deepmap/oapi-codegen/pkg/middleware"
	"github.com/go-openapi/runtime/middleware"
	"github.com/labstack/echo/v4"
	"net"
	"os"
)

func main() {
	port := flag.String("port", "8080", "Port for test HTTP server")
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
	srv := Server{}

	// This is how you set up a basic Echo router
	e := echo.New()
	// Log all requests
	//e.Use(echomiddleware.Logger())
	// Use our validation middleware to check all requests against the

	e.Use(omware.OapiRequestValidator(swagger))

	// We now register our srv above as the handler for the interface
	api.RegisterHandlers(e, &srv)
	opts1 := middleware.RedocOpts{SpecURL: "proxy-api.yaml", Path: "doc"}
	openAPIDoc := middleware.Redoc(opts1, nil)

	e.File("/proxy-api.yaml", "./proxy-api.yaml")
	e.GET("/doc", echo.WrapHandler(openAPIDoc))

	// And we serve HTTP until the world ends.
	e.Logger.Fatal(e.Start(net.JoinHostPort("0.0.0.0", *port)))
}
