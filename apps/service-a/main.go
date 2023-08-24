package main

import (
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"net"
	"net/http"
	"os"
	"packages/tcp-packet-handler"
	"strings"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		makeSomeTCPReq()
		w.Write([]byte("Hello from service A"))
	})
	http.ListenAndServe(":3000", r)
}

func makeSomeTCPReq() {
	const (
		HOST = "localhost"
		PORT = "4000"
		TYPE = "tcp"
	)

	address := fmt.Sprintf("%s:%s", HOST, PORT)
	tcpServer, err := net.ResolveTCPAddr(TYPE, address)

	if err != nil {
		println("ResolveTCPAddr failed:", err.Error())
		os.Exit(1)
	}

	conn, err := net.DialTCP(TYPE, nil, tcpServer)

	if err != nil {
		println("Dial failed:", err.Error())
		os.Exit(1)
	}

	defer conn.Close()

	// THIS SHOULD BE AN ENV VAR for port and service name
	requestPacket := tcp_packet_handler.GenerateRequestPacket("register service-a 3000")

	fmt.Println(string(requestPacket.GetRequest()))
	_, err = conn.Write(requestPacket.GetRequest())

	if err != nil {
		fmt.Println("Write data failed:", err.Error())
		return
	}

	responsePacket, err := tcp_packet_handler.HandleResponse(conn)

	if err != nil {
		fmt.Println("Read data failed:", err.Error())
		return
	}

	if responsePacket.Sequence() != requestPacket.Sequence() {
		fmt.Println("Response 1 sequence does not match request sequence", responsePacket.Sequence(), requestPacket.Sequence())
		return
	}

	fmt.Println("Registered service")

	requestService := tcp_packet_handler.GenerateRequestPacket("get service-a")
	fmt.Println(string(requestService.GetRequest()))

	_, err = conn.Write([]byte("get service-a"))
	if err != nil {
		fmt.Println("Write data failed:", err.Error())
		return
	}

	serviceResponse, err := tcp_packet_handler.HandleResponse(conn)

	if err != nil {
		fmt.Println("Read data failed:", err.Error())
		return
	}

	fmt.Println("Response 2 message:", strings.Join(serviceResponse.Data(), " "))
}
