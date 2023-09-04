package main

import (
	"encoding/gob"
	"fmt"
	"github.com/codewith-luke/disclone/packages/disclone-logger"
	"github.com/codewith-luke/disclone/packages/tcp-packet-handler"
	"github.com/joho/godotenv"
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

const (
	HOST = "localhost"
	TYPE = "tcp"
)

type Task string

const (
	REGISTER Task = "register"
	GET      Task = "get"
	UPDATE   Task = "update"
	REMOVE   Task = "remove"
)

type Enroller interface {
	Add(service ServiceConfig)
	Update(service ServiceConfig)
	Remove(serviceName string)
	Get(serviceName string) (ServiceConfig, error)
	Has(service string) bool
}

type RegistryServerConfig struct {
	port   string
	logger *slog.Logger
}

type ServiceConfig struct {
	Name   string
	Port   int32
	Domain string
}

func main() {
	opts := disclone_logger.PrettyHandlerOptions{
		SlogOpts: slog.HandlerOptions{
			Level: slog.LevelDebug,
		},
	}
	handler := disclone_logger.NewPrettyHandler(os.Stdout, opts)
	logger := slog.New(handler)

	loadEnvVariables(logger, ENV)

	PortNumber := os.Getenv(string(PORT))

	server, err := NewServer(RegistryServerConfig{
		port:   PortNumber,
		logger: logger,
	})

	if err != nil {
		logger.Error("failed to create server:", "err", err.Error())
		return
	}

	server.Open()
}

type Server struct {
	port     string
	logger   *slog.Logger
	listener net.Listener
}

func (s *Server) Open() {
	address := HOST + ":" + s.port
	listen, err := net.Listen(TYPE, address)

	if err != nil {
		log.Fatal(err)
	}

	s.listener = listen

	s.logger.Info("Listening on " + address)

	defer s.Close()

	registry := Registry{}

	gob.Register(tcp_packet_handler.RegisterReq{})
	gob.Register(tcp_packet_handler.RegisterGetReq{})
	gob.Register(ServiceConfig{})

	for {
		conn, err := s.listener.Accept()

		if err != nil {
			s.logger.Error("failed to accept connection:", "err", err.Error())
			return
		}

		//timeout := 5 * time.Second
		//err = conn.SetReadDeadline(time.Now().Add(timeout))
		//
		//if err != nil {
		//	s.logger.Error("failed to set read deadline:", "err", err.Error())
		//	return
		//}
		//
		//err = conn.SetWriteDeadline(time.Now().Add(timeout))
		//
		//if err != nil {
		//	s.logger.Error("failed to set write deadline:", "err", err.Error())
		//	return
		//}

		go handleRequest(s.logger, registry, conn)
	}
}

func (s *Server) Close() {
	s.listener.Close()
}

func NewServer(config RegistryServerConfig) (*Server, error) {
	if config.logger == nil {
		return nil, fmt.Errorf("logger is nil")
	}

	if config.port == "" {
		return nil, fmt.Errorf("invalid port")
	}

	return &Server{
		port:   config.port,
		logger: config.logger,
	}, nil
}

func handleRequest(logger *slog.Logger, registry Enroller, conn net.Conn) {
	enc := gob.NewEncoder(conn)
	dec := gob.NewDecoder(conn)

	addr, ok := conn.RemoteAddr().(*net.TCPAddr)

	if !ok {
		logger.Error("Have valid remote address")
		conn.Write([]byte("Invalid remote address"))
		conn.Close()
	}

	for {
		var packet tcp_packet_handler.Packet
		err := dec.Decode(&packet)

		if err != nil {
			logger.Error("decode error:", err)
			conn.Close()
			break
		}

		logger.Info("Received request", "packet", packet)
		serviceConfig, err := handleRegistry(registry, addr, packet)

		if err != nil {
			logger.Error("handleRegistry error:", "error", err.Error())
			conn.Close()
			return
		}

		packet.Data = serviceConfig

		err = enc.Encode(packet)

		if err != nil {
			logger.Error("failed to send message:", "err", err.Error())
			conn.Close()
			break
		}

		logger.Info("Sent response", "packet", packet)
		break
	}

	logger.Info("Connection closed")
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

func handleRegistry(registry Enroller, addr *net.TCPAddr, packet tcp_packet_handler.Packet) (ServiceConfig, error) {
	task := Task(packet.Task)

	switch task {
	case REGISTER:
		data := packet.Data.(tcp_packet_handler.RegisterReq)
		service := ServiceConfig{
			Name:   packet.Service,
			Port:   data.Port,
			Domain: addr.IP.String(),
		}

		if registry.Has(packet.Service) {
			registry.Update(service)
			return ServiceConfig{}, nil
		}

		registry.Add(service)

		fmt.Println("registered service: ", service.Name)

		return service, nil
	case GET:
		data := packet.Data.(tcp_packet_handler.RegisterGetReq)
		service, err := registry.Get(data.Service)

		fmt.Println("get service: ", data.Service)

		if err != nil {
			return ServiceConfig{
				Name:   data.Service,
				Port:   0,
				Domain: "",
			}, nil
		}

		return service, nil
	default:
		return ServiceConfig{}, fmt.Errorf("unknown task: %s", task)
	}
}
