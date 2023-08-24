package tcp_packet_handler

import (
	"encoding/binary"
	"math/rand"
	"net"
	"strings"
)

type RequestPacket struct {
	sequence uint32
	size     uint32
	data     []string
	request  []byte
}

func (requestPacket RequestPacket) Sequence() uint32 {
	return requestPacket.sequence
}

func (requestPacket RequestPacket) Size() uint32 {
	return requestPacket.size
}

func (requestPacket RequestPacket) Data() []string {
	return requestPacket.data
}

func (requestPacket RequestPacket) GetSize() uint32 {
	return 0
}

func (requestPacket RequestPacket) GetRequest() []byte {
	return requestPacket.request
}

func GenerateRequestPacket(data string) RequestPacket {
	sequence := rand.Uint32()
	dataLen := uint32(len(data))
	header := make([]byte, 8)
	binary.BigEndian.PutUint32(header[:4], sequence)
	binary.BigEndian.PutUint32(header[4:], dataLen)

	return RequestPacket{
		sequence: sequence,
		size:     dataLen,
		data:     []string{data},
		request:  append(header, []byte(data)...),
	}
}

func HandleRequest(conn net.Conn) (RequestPacket, error) {
	headerBuf := make([]byte, 8)

	_, err := conn.Read(headerBuf)

	if err != nil {
		return RequestPacket{}, err
	}

	sequence := binary.BigEndian.Uint32(headerBuf[:4])
	size := binary.BigEndian.Uint32(headerBuf[4:])

	dataBuf := make([]byte, size)
	_, err = conn.Read(dataBuf)

	if err != nil {
		return RequestPacket{}, err
	}

	data := strings.Split(string(dataBuf[:]), " ")

	return RequestPacket{
		sequence: sequence,
		size:     size,
		data:     data,
	}, nil
}

type ResponsePacket struct {
	sequence uint32
	size     uint32
	resSize  uint32
	data     []string
}

func (responsePacket ResponsePacket) Sequence() uint32 {
	return responsePacket.sequence
}

func (responsePacket ResponsePacket) Size() uint32 {
	return responsePacket.size
}

func (responsePacket ResponsePacket) ResSize() uint32 {
	return responsePacket.resSize
}

func (responsePacket ResponsePacket) Data() []string {
	return responsePacket.data
}

func HandleResponse(conn net.Conn) (ResponsePacket, error) {
	headerBuf := make([]byte, 12)

	_, err := conn.Read(headerBuf)

	if err != nil {
		return ResponsePacket{}, err
	}

	sequence := binary.BigEndian.Uint32(headerBuf[:4])
	size := binary.BigEndian.Uint32(headerBuf[4:8])
	resSize := binary.BigEndian.Uint32(headerBuf[8:])

	dataBuf := make([]byte, resSize)
	_, err = conn.Read(dataBuf)

	if err != nil {
		return ResponsePacket{}, err
	}

	data := strings.Split(string(headerBuf[:]), " ")

	return ResponsePacket{
		sequence: sequence,
		size:     size,
		resSize:  resSize,
		data:     data,
	}, nil
}
