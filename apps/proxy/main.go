//go:generate go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen --config=models.cfg.yaml ../api.yaml
//go:generate go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen --config=server.cfg.yaml ../api.yaml

package main
