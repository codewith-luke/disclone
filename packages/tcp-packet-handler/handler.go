package tcp_packet_handler

import (
	"encoding/gob"
	"fmt"
	"net"
)

type Packet struct {
	Sequence uint32
	Service  string
	Task     string
	Data     any
}

type RegisterReq struct {
	Port int32
}

type RegisterGetReq struct {
	Service string
}

type ClientConfig struct {
	Host string
	Port string
}

type Client struct {
	host string
	port string
	conn net.Conn
	enc  *gob.Encoder
	dec  *gob.Decoder
}

func NewClient(config ClientConfig) *Client {
	return &Client{
		host: config.Host,
		port: config.Port,
	}
}

func (c *Client) Register(value any) {
	gob.Register(value)
}

func (c *Client) Open() error {
	addr := fmt.Sprintf("%s:%s", c.host, c.port)
	conn, err := net.Dial("tcp", addr)

	if err != nil {
		fmt.Println("Error connecting:", err.Error())
		return err
	}

	c.conn = conn

	gob.Register(RegisterReq{})
	gob.Register(RegisterGetReq{})

	enc := gob.NewEncoder(conn)
	dec := gob.NewDecoder(conn)

	c.dec = dec
	c.enc = enc

	return nil
}

func (c *Client) Close() error {
	return c.conn.Close()
}

func (c *Client) Send(data Packet) error {
	err := c.enc.Encode(data)

	if err != nil {
		return err
	}

	return nil
}

func (c *Client) Receive() (Packet, error) {
	var data Packet
	err := c.dec.Decode(&data)

	if err != nil {
		return Packet{}, err
	}

	return data, nil
}
