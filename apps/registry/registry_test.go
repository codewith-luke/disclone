package main_test

import (
	"github.com/codewith-luke/disclone/apps/registry"
	"testing"
)

func TestRegistry(t *testing.T) {
	sut := main.Registry{}
	service := main.ServiceConfig{
		Name:   "test",
		Port:   8080,
		Domain: "localhost",
	}

	_, err := sut.Get(service.Name)

	if err == nil {
		t.Errorf("expected %v to not be in registry", service)
	}

	sut.Add(service)
	hasService := sut.Has(service.Name)

	if !hasService {
		t.Errorf("expected %v to be in registry", service)
	}

	sut.Update(main.ServiceConfig{
		Name:   "test",
		Port:   3000,
		Domain: "localhost",
	})

	service, _ = sut.Get(service.Name)

	if service.Port != 3000 {
		t.Errorf("expected %v to be updated in registry", service)
	}

	sut.Remove(service.Name)
	hasService = sut.Has(service.Name)

	if hasService {
		t.Errorf("expected %v to be removed from registry", service)
	}
}
