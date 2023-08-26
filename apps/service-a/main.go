package main

import (
	"encoding/gob"
	"fmt"
	"log"
	"net"
	"os"
	tcp_packet_handler "packages/tcp-packet-handler"
)

const (
	HOST = "localhost"
	PORT = "4000"
	TYPE = "tcp"
)

type ServiceConfig struct {
	Name   string
	Port   int32
	Domain string
}

func main() {

	tcpServer, err := net.ResolveTCPAddr(TYPE, HOST+":"+PORT)

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

	gob.Register(tcp_packet_handler.RegisterReq{})
	gob.Register(tcp_packet_handler.RegisterGet{})
	gob.Register(ServiceConfig{})

	enc := gob.NewEncoder(conn)

	//err = enc.Encode(tcp_packet_handler.Packet{
	//	Sequence: 12345,
	//	Task:     "register",
	//	Service:  "service_a",
	//	Data:     tcp_packet_handler.RegisterReq{Port: 3001},
	//})

	err = enc.Encode(tcp_packet_handler.Packet{
		Sequence: 12345,
		Task:     "get",
		Service:  "service_a",
		Data:     tcp_packet_handler.RegisterGet{Service: "service_b"},
	})

	if err != nil {
		println("Encode failed:", err.Error())
		return
	}

	dec := gob.NewDecoder(conn)

	for {
		var packet tcp_packet_handler.Packet
		err := dec.Decode(&packet)

		if err != nil {
			log.Fatal("decode error:", err)
		}

		fmt.Println(packet)
		break
	}
}
