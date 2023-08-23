package main

import (
	"encoding/binary"
	"fmt"
	"github.com/joho/godotenv"
	"io"
	"log"
	"log/slog"
	"net"
	"os"
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

type PacketData struct {
	Task    Task
	Service string
	Port    int
}

func main() {
	loadEnvVariables(ENV)

	PortNumber := os.Getenv(string(PORT))

	address := fmt.Sprintf("%s:%s", HOST, PortNumber)
	slog.Info("Starting registry server on port: " + PortNumber)
	listen, err := net.Listen(TYPE, address)

	if err != nil {
		log.Fatal(err)
	}

	for {
		conn, err := listen.Accept()

		if err != nil {
			log.Fatal(err)
		}

		go handleRequest(conn)
	}
}

func loadEnvVariables(key EnvKeys) {
	env := os.Getenv(string(key))

	if len(env) == 0 {
		env = "development"
	}

	envFile := fmt.Sprintf(".%s.env", env)

	err := godotenv.Load(envFile)

	if err != nil {
		log.Fatalf("Error loading %s file", envFile)
	}
}

func handleRequest(conn net.Conn) {
	buf := make([]byte, 4)

	if _, err := io.ReadFull(conn, buf); err != nil {
		slog.Error("Error reading size: " + err.Error())
		log.Fatal(err)
	}

	fmt.Printf("message size: %d", buf)
	size := binary.BigEndian.Uint32(buf)
	buffer := make([]byte, size)
	_, err := conn.Read(buffer)

	if err != nil {
		return
	}

	if addr, ok := conn.RemoteAddr().(*net.TCPAddr); ok {
		fmt.Println(addr.IP.String())
	}

	if err != nil {
		fmt.Printf("Error reading: %s", err.Error())
	}

	data, err := getData(buffer)

	if err != nil {
		log.Fatal(err)
	}

	message := fmt.Sprintf("task: %s - service name: %s - port: %d", data.Task, data.Service, data.Port)

	conn.Write([]byte(message))
	conn.Close()
}

func getData(buf []byte) (PacketData, error) {
	requestData := string(buf[:])
	data := strings.Split(requestData, " ")

	taskStr := data[0]
	service := data[1]
	portStr := data[2]

	task := Task(taskStr)
	port, err := strconv.Atoi(portStr)

	if err != nil {
		return PacketData{}, err
	}

	switch task {
	case Register:
		fmt.Println("Registering service...")
	default:
		fmt.Println("Unknown task")
		return PacketData{}, fmt.Errorf("unknown task")
	}

	return PacketData{
		Task:    task,
		Service: service,
		Port:    port,
	}, nil
}
