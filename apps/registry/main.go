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
	"strconv"
	"strings"
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
	Register Task = "register"
)

type Enroller interface {
	add(service Service)
	update(service Service)
	remove(serviceName string)
	get(serviceName string) (Service, error)
	has(service string) bool
}

// TODO: this needs to be an array of Service in a map
type Registry map[string]Service

func (registry Registry) add(service Service) {
	registry[service.Name] = service
}

func (registry Registry) update(service Service) {
	registry[service.Name] = service
}

func (registry Registry) remove(serviceName string) {
	delete(registry, serviceName)
}

func (registry Registry) get(serviceName string) (Service, error) {
	if _, ok := registry[serviceName]; !ok {
		return Service{}, fmt.Errorf("service not found")
	}

	return registry[serviceName], nil
}

func (registry Registry) has(service string) bool {
	_, ok := registry[service]

	return ok
}

type Service struct {
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

	address := fmt.Sprintf("%s:%s", HOST, PortNumber)
	logger.Info("Starting registry server on port: " + PortNumber)
	listen, err := net.Listen(TYPE, address)

	if err != nil {
		log.Fatal(err)
	}

	registry := Registry{}

	registry.add(Service{})

	for {
		conn, err := listen.Accept()

		if err != nil {
			log.Fatal(err)
		}

		go handleRequest(logger, registry, conn)
	}
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

func handleRequest(logger *slog.Logger, registry Enroller, conn net.Conn) {
	buf := make([]byte, 4)

	_, err := conn.Read(buf)

	if err != nil {
		logger.Error("Error reading size", "error", err.Error())
		return
	}

	size := binary.BigEndian.Uint32(buf)

	logger.Info("Message Size", "size", size)

	buffer := make([]byte, size)
	_, err = conn.Read(buffer)

	if err != nil {
		logger.Error("Error reading data", "error", err.Error())
		return
	}

	addr, ok := conn.RemoteAddr().(*net.TCPAddr)

	if !ok {
		logger.Error("Have valid remote address", "")
		conn.Write([]byte("Invalid remote address"))
		conn.Close()
	}

	serviceName, err := getData(registry, addr, buffer)

	if err != nil {
		logger.Error("Error reading", "error", err.Error())
	}

	data, err := registry.get(serviceName)

	if err != nil {
		logger.Error("Error getting service", "error", err.Error())

		conn.Write([]byte("Service not found"))
		conn.Close()
	}

	message := fmt.Sprintf("task: %s - service name: %s - port: %d", data.Name, data.Domain, data.Port)

	conn.Write([]byte(message))
	conn.Close()
}

func getData(registry Enroller, addr *net.TCPAddr, buf []byte) (string, error) {
	requestData := string(buf[:])
	data := strings.Split(requestData, " ")

	taskStr := data[0]
	service := data[1]
	portStr := data[2]

	task := Task(taskStr)
	port, err := strconv.Atoi(portStr)

	if registry.has(service) {
		return service, nil
	}

	if err != nil {
		return "", err
	}

	switch task {
	case Register:
		registry.add(Service{
			Name:   service,
			Port:   int32(port),
			Domain: addr.IP.String(),
		})
	default:
		return "", fmt.Errorf("unknown task: %s", task)
	}

	return service, nil
}
