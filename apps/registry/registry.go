package main

import "fmt"

// TODO: this needs to be an array of ServiceConfig in a map
type Registry map[string]ServiceConfig

func (registry Registry) Add(service ServiceConfig) {
	registry[service.Name] = service
}

func (registry Registry) Update(service ServiceConfig) {
	registry[service.Name] = service
}

func (registry Registry) Remove(serviceName string) {
	delete(registry, serviceName)
}

func (registry Registry) Get(serviceName string) (ServiceConfig, error) {
	if _, ok := registry[serviceName]; !ok {
		return ServiceConfig{}, fmt.Errorf("service not found")
	}

	return registry[serviceName], nil
}

func (registry Registry) Has(service string) bool {
	_, ok := registry[service]

	return ok
}
