package main

import (
	"encoding/binary"
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"log/slog"
	"net"
	"os"
	"packages/disclone-logger"
	tcp_packet_handler "packages/tcp-packet-handler"
	"strconv"
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

type Requester interface {
	Sequence() uint32
	Size() uint32
	Data() []string
}

type RegistryServerConfig struct {
	PortNumber string
	logger     *slog.Logger
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
	startServer(RegistryServerConfig{
		PortNumber: PortNumber,
		logger:     logger,
	})
}

func startServer(config RegistryServerConfig) {
	address := fmt.Sprintf("%s:%s", HOST, config.PortNumber)
	config.logger.Info("Starting registry server on port: " + config.PortNumber)
	listen, err := net.Listen(TYPE, address)

	if err != nil {
		log.Fatal(err)
	}

	registry := Registry{}

	registry.Add(ServiceConfig{})

	for {
		conn, err := listen.Accept()

		if err != nil {
			log.Fatal(err)
		}

		go handleRequest(config.logger, registry, conn)
	}
}

func handleRequest(logger *slog.Logger, registry Enroller, conn net.Conn) {
	requestPacket, err := tcp_packet_handler.HandleRequest(conn)

	if err != nil {
		logger.Error("Error reading", "error", err.Error())
		conn.Write([]byte("Invalid request"))
		conn.Close()
	}

	addr, ok := conn.RemoteAddr().(*net.TCPAddr)

	if !ok {
		logger.Error("Have valid remote address")
		conn.Write([]byte("Invalid remote address"))
		conn.Close()
	}

	message, err := handleRegistry(registry, addr, requestPacket)

	if err != nil {
		logger.Error("Error with registry handle", "error", err.Error())
	}

	header := make([]byte, 12)
	binary.BigEndian.PutUint32(header[:4], requestPacket.Sequence())
	binary.BigEndian.PutUint32(header[4:8], requestPacket.Size())
	binary.BigEndian.PutUint32(header[8:], uint32(len(message)))

	final := append(header, []byte(message)...)
	fmt.Println("Response", message)
	conn.Write(final)
	conn.Close()
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

func handleRegistry(registry Enroller, addr *net.TCPAddr, packet Requester) (string, error) {
	message := ""
	data := packet.Data()

	taskStr := data[0]
	task := Task(taskStr)

	switch task {
	case REGISTER:
		serviceName := data[1]
		portStr := data[2]

		port, err := strconv.Atoi(portStr)

		if err != nil {
			return "", err
		}

		service := ServiceConfig{
			Name:   serviceName,
			Port:   int32(port),
			Domain: addr.IP.String(),
		}

		if registry.Has(serviceName) {
			registry.Update(service)
			return "", nil
		}

		registry.Add(service)
		return "", err
	case GET:
		serviceName := data[1]

		s, err := registry.Get(serviceName)

		if err != nil {
			return "", fmt.Errorf("serviceName not found: %s", serviceName)
		}

		message = fmt.Sprintf("%s %d %s", s.Name, s.Port, s.Domain)
	default:
		return "", fmt.Errorf("unknown task: %s", task)
	}

	return message, nil
}
