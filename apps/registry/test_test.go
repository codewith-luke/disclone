package main

import (
	"errors"
	"net"
)

type Test struct {
	addr   string
	server net.Listener
}

// NewServer creates a new Server using given protocol
// and addr.
func NewTestS() (*Test, error) {
	addr := HOST + ":" + "4000"
	return &Test{
		addr: addr,
	}, nil
}

// TCPServer holds the structure of our TCP
// implementation.
type TCPServer struct {
	addr   string
	server net.Listener
}

// Run starts the TCP Server.
func (t *Test) Run() (err error) {
	t.server, err = net.Listen("tcp", t.addr)
	if err != nil {
		return
	}
	for {
		conn, err := t.server.Accept()
		if err != nil {
			err = errors.New("could not accept connection")
			break
		}
		if conn == nil {
			err = errors.New("could not create connection")
			break
		}
		conn.Close()
	}
	return
}

// Close shuts down the TCP Server
func (t *Test) Close() (err error) {
	return t.server.Close()
}
