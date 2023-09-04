package main

import (
	"fmt"
	"github.com/codewith-luke/disclone/packages/tcp-packet-handler"
	"math/rand"
	"os"
	"sync"
)

type ServiceConfig struct {
	Name   string
	Port   int32
	Domain string
}

type RegistryCache struct {
	mu       sync.RWMutex
	services map[string]ServiceConfig
	client   *tcp_packet_handler.Client
}

func NewRegistryCache() (*RegistryCache, error) {
	port := os.Getenv(string(REGISTRY_PORT))

	if port == "" {
		return nil, fmt.Errorf("no registry port specified")
	}

	host := os.Getenv(string(REGISTRY_HOST))

	if host == "" {
		return nil, fmt.Errorf("no registry host specified")
	}

	client := tcp_packet_handler.NewClient(tcp_packet_handler.ClientConfig{
		Host: host,
		Port: port,
	})

	client.Register(ServiceConfig{})

	return &RegistryCache{
		client:   client,
		services: make(map[string]ServiceConfig),
	}, nil
}

func (cache *RegistryCache) GetService(name string) (ServiceConfig, error) {
	if service := cache.getService(name); service != nil {
		fmt.Println("cache hit")
		return *service, nil
	}

	fmt.Println("cache miss")

	err := cache.client.Open()

	if err != nil {
		return ServiceConfig{}, err
	}

	defer cache.client.Close()

	serviceName := os.Getenv(string(SERVICE_NAME))

	if serviceName == "" {
		return ServiceConfig{}, fmt.Errorf("no service name specified")
	}

	seq := rand.Uint32()
	err = cache.client.Send(tcp_packet_handler.Packet{
		Sequence: seq,
		Service:  serviceName,
		Task:     tcp_packet_handler.GET,
		Data: tcp_packet_handler.RegisterGetReq{
			Service: name,
		},
	})

	if err != nil {
		return ServiceConfig{}, err
	}

	var response tcp_packet_handler.Packet

	err = cache.client.Receive(&response)

	if err != nil {
		return ServiceConfig{}, err
	}

	switch response.Task {
	case tcp_packet_handler.GET:
		service := response.Data.(ServiceConfig)
		cache.cacheService(service.Name, service)
		return service, nil
	default:
		return ServiceConfig{}, err
	}
}

func (cache *RegistryCache) getService(name string) *ServiceConfig {
	cache.mu.RLock()
	defer cache.mu.RUnlock()

	if service, ok := cache.services[name]; ok {
		return &service
	}

	return nil
}

func (cache *RegistryCache) cacheService(name string, service ServiceConfig) {
	cache.mu.Lock()
	defer cache.mu.Unlock()

	if service.Port == 0 {
		return
	}

	cache.services[name] = service
}
