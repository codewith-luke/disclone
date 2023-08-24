package main

import (
	"log/slog"
	"os"
	"packages/disclone-logger"
	"testing"
)

func setupServer() {
	opts := disclone_logger.PrettyHandlerOptions{
		SlogOpts: slog.HandlerOptions{
			Level: slog.LevelDebug,
		},
	}
	handler := disclone_logger.NewPrettyHandler(os.Stdout, opts)
	logger := slog.New(handler)

	startServer(RegistryServerConfig{
		PortNumber: "8080",
		logger:     logger,
	})
}

func TestRegistry_Add(t *testing.T) {

}
