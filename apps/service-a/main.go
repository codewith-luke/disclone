package main

import (
	"encoding/binary"
	"fmt"
	"github.com/go-chi/chi/v5"
	"net"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5/middleware"
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

	// THIS SHOULD BE AN ENV VAR
	data := fmt.Sprintf("register service_a %s", "3000")
	dataLen := uint32(len(data))
	size := make([]byte, 4)
	binary.BigEndian.PutUint32(size, dataLen)
	final := append(size, []byte(data)...)

	_, err = conn.Write(final)

	if err != nil {
		println("Write data failed:", err.Error())
		os.Exit(1)
	}

	// buffer to get data
	received := make([]byte, 1024)
	_, err = conn.Read(received)

	if err != nil {
		println("Read data failed:", err.Error())
		os.Exit(1)
	}

	println("Received message:", string(received))

	conn.Close()
}
