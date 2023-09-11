//go:generate oapi-codegen --config=./api/models/models.cfg.yaml ./proxy-api.yaml
//go:generate oapi-codegen --config=./api/server.cfg.yaml ./proxy-api.yaml

package main

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

type Server struct {
}

func (s *Server) GetProxy(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "Doc: not implemented")
}

func (s *Server) GetDoc(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "Doc: not implemented")
}

func (s *Server) GetDocs(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "Docs: not implemented")
}

func (s *Server) Login(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "this is a test")
}

func (s *Server) Logout(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "Logout: not implemented")
}

func (s *Server) Register(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "Register: not implemented")
}

func (s *Server) GetGroups(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "GetGroups: not implemented")
}

func (s *Server) CreateGroup(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "CreateGroup: not implemented")
}

func (s *Server) GetGroup(ctx echo.Context, id int64) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "GetGroup: not implemented")
}

func (s *Server) GetGroupMembers(ctx echo.Context, id int64) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "GetGroupMembers: not implemented")
}

func (s *Server) GetGroupMessages(ctx echo.Context, id int64) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "GetGroupMessages: not implemented")
}

func (s *Server) SendMessageToGroup(ctx echo.Context, id int64) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "SendMessageToGroup: not implemented")
}

func (s *Server) GetProfile(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "GetProfile: not implemented")
}

func (s *Server) GetSettings(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "GetSettings: not implemented")
}

func (s *Server) UpdateProfile(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "UpdateProfile: not implemented")
}

func (s *Server) UpdateSettings(ctx echo.Context) error {
	return echo.NewHTTPError(http.StatusNotImplemented, "UpdateSettings: not implemented")
}
