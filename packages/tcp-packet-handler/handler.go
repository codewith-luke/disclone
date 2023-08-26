package tcp_packet_handler

type Packet struct {
	Sequence uint32
	Service  string
	Task     string
	Data     any
}

type RegisterReq struct {
	Port int32
}

type RegisterGet struct {
	Service string
}
