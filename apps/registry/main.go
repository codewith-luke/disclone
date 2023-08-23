package main

import (
	"encoding/binary"
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"strconv"
	"strings"
)

const (
	HOST = "localhost"
	PORT = "4000"
	TYPE = "tcp"
)

func main() {
	address := fmt.Sprintf("%s:%s", HOST, PORT)

	listen, err := net.Listen(TYPE, address)

	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	for {
		conn, err := listen.Accept()

		if err != nil {
			log.Fatal(err)
			os.Exit(1)
		}

		go handleRequest(conn)
	}
}

func handleRequest(conn net.Conn) {
	buf := make([]byte, 4)

	if _, err := io.ReadFull(conn, buf); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("size: %d", buf)
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
		log.Fatal(err)
	}

	// write data to response
	//time := time.Now().Format(time.ANSIC)
	data, err := getData(buffer)

	if err != nil {
		log.Fatal(err)
	}

	message := fmt.Sprintf("task: %s - service name: %s - port: %d", data.Task, data.Service, data.Port)

	conn.Write([]byte(message))
	conn.Close()
}

type Task string

const (
	Register Task = "register"
)

type PacketData struct {
	Task    Task
	Service string
	Port    int
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
