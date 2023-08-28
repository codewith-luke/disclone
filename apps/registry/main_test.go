package main

import (
	"encoding/gob"
	"fmt"
	"log"
	"log/slog"
	"net"
	"os"
	"packages/disclone-logger"
	"packages/tcp-packet-handler"
	"reflect"
	"testing"
	"time"
)

const (
	testPort = "4000"
	testHost = "localhost"
	testType = "tcp"
)

func setupServer() (*Server, error) {
	opts := disclone_logger.PrettyHandlerOptions{
		SlogOpts: slog.HandlerOptions{
			Level: slog.LevelDebug,
		},
	}
	handler := disclone_logger.NewPrettyHandler(os.Stdout, opts)
	logger := slog.New(handler)

	server, err := NewServer(RegistryServerConfig{
		port:   testPort,
		logger: logger,
	})

	return server, err
}

func setupClient() (net.Conn, *gob.Encoder, *gob.Decoder, error) {
	addr := fmt.Sprintf("%s:%s", testHost, testPort)

	conn, err := net.Dial(testType, addr)

	if err != nil {
		fmt.Println("Error connecting:", err.Error())
		return nil, nil, nil, err
	}

	gob.Register(tcp_packet_handler.RegisterReq{})
	gob.Register(tcp_packet_handler.RegisterGetReq{})
	gob.Register(ServiceConfig{})

	enc := gob.NewEncoder(conn)
	dec := gob.NewDecoder(conn)

	return conn, enc, dec, nil
}

func init() {
	s, err := setupServer()

	if err != nil {
		log.Fatalf("failed to setup server: %s", err.Error())
	}

	go func() {
		fmt.Println("server open")
		s.Open()
	}()

	time.Sleep(1 * time.Second)
}

func TestRegistryServer(t *testing.T) {
	tt := []struct {
		Name string
		Data tcp_packet_handler.Packet
	}{
		{
			Name: "register_empty",
			Data: tcp_packet_handler.Packet{
				Sequence: 12345,
				Task:     "get",
				Service:  "service_a",
				Data:     tcp_packet_handler.RegisterGetReq{Service: "service_b"},
			},
		},
		{
			Name: "register_service_a",
			Data: tcp_packet_handler.Packet{
				Sequence: 12346,
				Task:     "register",
				Service:  "service_a",
				Data: tcp_packet_handler.RegisterReq{
					Port: 1234,
				},
			},
		},
		{
			Name: "get_service_a",
			Data: tcp_packet_handler.Packet{
				Sequence: 12347,
				Task:     "get",
				Service:  "service_b",
				Data:     tcp_packet_handler.RegisterGetReq{Service: "service_a"},
			},
		},
	}

	t.Run(tt[0].Name, func(t *testing.T) {
		conn, enc, dec, err := setupClient()

		if err != nil {
			t.Error("could not setup client")
			return
		}

		defer conn.Close()

		err = enc.Encode(tt[0].Data)

		var got tcp_packet_handler.Packet
		want := tcp_packet_handler.Packet{
			Sequence: 12345,
			Task:     "get",
			Service:  "service_a",
			Data: ServiceConfig{
				Name:   "service_b",
				Port:   0,
				Domain: "",
			},
		}

		err = dec.Decode(&got)

		if err != nil {
			t.Errorf("test decode error: %s", err.Error())
		}

		if got.Sequence != want.Sequence {
			t.Errorf("got %d want %d", got.Sequence, want.Sequence)
		}

		if got.Task != want.Task {
			t.Errorf("got %s want %s", got.Task, want.Task)
		}

		if got.Service != want.Service {
			t.Errorf("got %s want %s", got.Service, want.Service)
		}

		if got.Data.(ServiceConfig).Name != want.Data.(ServiceConfig).Name {
			t.Errorf("got %s want %s", got.Data.(ServiceConfig).Name, want.Data.(ServiceConfig).Name)
		}
	})

	t.Run(tt[1].Name, func(t *testing.T) {
		conn, enc, dec, err := setupClient()

		if err != nil {
			t.Error("could not setup client")
			return
		}

		defer conn.Close()

		err = enc.Encode(tt[1].Data)

		var got tcp_packet_handler.Packet
		want := tcp_packet_handler.Packet{
			Sequence: 12346,
			Task:     "register",
			Service:  "service_a",
			Data: ServiceConfig{
				Name:   "service_a",
				Port:   1234,
				Domain: "127.0.0.1",
			},
		}

		err = dec.Decode(&got)

		if err != nil {
			t.Errorf("test decode error: %s", err.Error())
		}

		if got.Sequence != want.Sequence {
			t.Errorf("got %d want %d", got.Sequence, want.Sequence)
		}

		if got.Task != want.Task {
			t.Errorf("got %s want %s", got.Task, want.Task)
		}

		if got.Service != want.Service {
			t.Errorf("got %s want %s", got.Service, want.Service)
		}

		if !reflect.DeepEqual(got.Data.(ServiceConfig), want.Data.(ServiceConfig)) {
			t.Errorf("got %s want %s", got.Data.(ServiceConfig).Name, want.Data.(ServiceConfig).Name)
		}
	})

	t.Run(tt[2].Name, func(t *testing.T) {
		conn, enc, dec, err := setupClient()

		if err != nil {
			t.Error("could not setup client")
			return
		}

		defer conn.Close()

		err = enc.Encode(tt[2].Data)

		var got tcp_packet_handler.Packet
		want := tcp_packet_handler.Packet{
			Sequence: 12347,
			Task:     "get",
			Service:  "service_b",
			Data: ServiceConfig{
				Name:   "service_a",
				Port:   1234,
				Domain: "127.0.0.1",
			},
		}

		err = dec.Decode(&got)

		if err != nil {
			t.Errorf("test decode error: %s", err.Error())
		}

		if got.Sequence != want.Sequence {
			t.Errorf("got %d want %d", got.Sequence, want.Sequence)
		}

		if got.Task != want.Task {
			t.Errorf("got %s want %s", got.Task, want.Task)
		}

		if got.Service != want.Service {
			t.Errorf("got %s want %s", got.Service, want.Service)
		}

		if !reflect.DeepEqual(got.Data.(ServiceConfig), want.Data.(ServiceConfig)) {
			t.Errorf("got %s want %s", got.Data.(ServiceConfig).Name, want.Data.(ServiceConfig).Name)
		}
	})
}
