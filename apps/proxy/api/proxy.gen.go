// Package api provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.13.4 DO NOT EDIT.
package api

import (
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"fmt"
	"net/http"
	"net/url"
	"path"
	"strings"

	"github.com/deepmap/oapi-codegen/pkg/runtime"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/labstack/echo/v4"
)

// ServerInterface represents all server handlers.
type ServerInterface interface {

	// (GET /doc)
	GetDoc(ctx echo.Context) error

	// (GET /docs)
	GetDocs(ctx echo.Context) error

	// (GET /groups)
	GetGroups(ctx echo.Context) error

	// (POST /groups/new)
	CreateGroup(ctx echo.Context) error

	// (GET /groups/{id}/)
	GetGroup(ctx echo.Context, id int64) error

	// (GET /groups/{id}/members)
	GetGroupMembers(ctx echo.Context, id int64) error

	// (GET /groups/{id}/messages)
	GetGroupMessages(ctx echo.Context, id int64) error

	// (POST /groups/{id}/messages)
	SendMessageToGroup(ctx echo.Context, id int64) error

	// (POST /login)
	Login(ctx echo.Context) error

	// (POST /logout)
	Logout(ctx echo.Context) error

	// (GET /profile)
	GetProfile(ctx echo.Context) error

	// (PATCH /profile)
	UpdateProfile(ctx echo.Context) error

	// (GET /profile/settings)
	GetSettings(ctx echo.Context) error

	// (PATCH /profile/settings)
	UpdateSettings(ctx echo.Context) error

	// (GET /proxy-api.yaml)
	GetProxy(ctx echo.Context) error

	// (POST /register)
	Register(ctx echo.Context) error
}

// ServerInterfaceWrapper converts echo contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler ServerInterface
}

// GetDoc converts echo context to params.
func (w *ServerInterfaceWrapper) GetDoc(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetDoc(ctx)
	return err
}

// GetDocs converts echo context to params.
func (w *ServerInterfaceWrapper) GetDocs(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetDocs(ctx)
	return err
}

// GetGroups converts echo context to params.
func (w *ServerInterfaceWrapper) GetGroups(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetGroups(ctx)
	return err
}

// CreateGroup converts echo context to params.
func (w *ServerInterfaceWrapper) CreateGroup(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.CreateGroup(ctx)
	return err
}

// GetGroup converts echo context to params.
func (w *ServerInterfaceWrapper) GetGroup(ctx echo.Context) error {
	var err error
	// ------------- Path parameter "id" -------------
	var id int64

	err = runtime.BindStyledParameterWithLocation("simple", false, "id", runtime.ParamLocationPath, ctx.Param("id"), &id)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Invalid format for parameter id: %s", err))
	}

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetGroup(ctx, id)
	return err
}

// GetGroupMembers converts echo context to params.
func (w *ServerInterfaceWrapper) GetGroupMembers(ctx echo.Context) error {
	var err error
	// ------------- Path parameter "id" -------------
	var id int64

	err = runtime.BindStyledParameterWithLocation("simple", false, "id", runtime.ParamLocationPath, ctx.Param("id"), &id)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Invalid format for parameter id: %s", err))
	}

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetGroupMembers(ctx, id)
	return err
}

// GetGroupMessages converts echo context to params.
func (w *ServerInterfaceWrapper) GetGroupMessages(ctx echo.Context) error {
	var err error
	// ------------- Path parameter "id" -------------
	var id int64

	err = runtime.BindStyledParameterWithLocation("simple", false, "id", runtime.ParamLocationPath, ctx.Param("id"), &id)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Invalid format for parameter id: %s", err))
	}

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetGroupMessages(ctx, id)
	return err
}

// SendMessageToGroup converts echo context to params.
func (w *ServerInterfaceWrapper) SendMessageToGroup(ctx echo.Context) error {
	var err error
	// ------------- Path parameter "id" -------------
	var id int64

	err = runtime.BindStyledParameterWithLocation("simple", false, "id", runtime.ParamLocationPath, ctx.Param("id"), &id)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, fmt.Sprintf("Invalid format for parameter id: %s", err))
	}

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.SendMessageToGroup(ctx, id)
	return err
}

// Login converts echo context to params.
func (w *ServerInterfaceWrapper) Login(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.Login(ctx)
	return err
}

// Logout converts echo context to params.
func (w *ServerInterfaceWrapper) Logout(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.Logout(ctx)
	return err
}

// GetProfile converts echo context to params.
func (w *ServerInterfaceWrapper) GetProfile(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetProfile(ctx)
	return err
}

// UpdateProfile converts echo context to params.
func (w *ServerInterfaceWrapper) UpdateProfile(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.UpdateProfile(ctx)
	return err
}

// GetSettings converts echo context to params.
func (w *ServerInterfaceWrapper) GetSettings(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetSettings(ctx)
	return err
}

// UpdateSettings converts echo context to params.
func (w *ServerInterfaceWrapper) UpdateSettings(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.UpdateSettings(ctx)
	return err
}

// GetProxy converts echo context to params.
func (w *ServerInterfaceWrapper) GetProxy(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.GetProxy(ctx)
	return err
}

// Register converts echo context to params.
func (w *ServerInterfaceWrapper) Register(ctx echo.Context) error {
	var err error

	// Invoke the callback with all the unmarshaled arguments
	err = w.Handler.Register(ctx)
	return err
}

// This is a simple interface which specifies echo.Route addition functions which
// are present on both echo.Echo and echo.Group, since we want to allow using
// either of them for path registration
type EchoRouter interface {
	CONNECT(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	DELETE(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	GET(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	HEAD(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	OPTIONS(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	PATCH(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	POST(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	PUT(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
	TRACE(path string, h echo.HandlerFunc, m ...echo.MiddlewareFunc) *echo.Route
}

// RegisterHandlers adds each server route to the EchoRouter.
func RegisterHandlers(router EchoRouter, si ServerInterface) {
	RegisterHandlersWithBaseURL(router, si, "")
}

// Registers handlers, and prepends BaseURL to the paths, so that the paths
// can be served under a prefix.
func RegisterHandlersWithBaseURL(router EchoRouter, si ServerInterface, baseURL string) {

	wrapper := ServerInterfaceWrapper{
		Handler: si,
	}

	router.GET(baseURL+"/doc", wrapper.GetDoc)
	router.GET(baseURL+"/docs", wrapper.GetDocs)
	router.GET(baseURL+"/groups", wrapper.GetGroups)
	router.POST(baseURL+"/groups/new", wrapper.CreateGroup)
	router.GET(baseURL+"/groups/:id/", wrapper.GetGroup)
	router.GET(baseURL+"/groups/:id/members", wrapper.GetGroupMembers)
	router.GET(baseURL+"/groups/:id/messages", wrapper.GetGroupMessages)
	router.POST(baseURL+"/groups/:id/messages", wrapper.SendMessageToGroup)
	router.POST(baseURL+"/login", wrapper.Login)
	router.POST(baseURL+"/logout", wrapper.Logout)
	router.GET(baseURL+"/profile", wrapper.GetProfile)
	router.PATCH(baseURL+"/profile", wrapper.UpdateProfile)
	router.GET(baseURL+"/profile/settings", wrapper.GetSettings)
	router.PATCH(baseURL+"/profile/settings", wrapper.UpdateSettings)
	router.GET(baseURL+"/proxy-api.yaml", wrapper.GetProxy)
	router.POST(baseURL+"/register", wrapper.Register)

}

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"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",
}

// GetSwagger returns the content of the embedded swagger specification file
// or error if failed to decode
func decodeSpec() ([]byte, error) {
	zipped, err := base64.StdEncoding.DecodeString(strings.Join(swaggerSpec, ""))
	if err != nil {
		return nil, fmt.Errorf("error base64 decoding spec: %w", err)
	}
	zr, err := gzip.NewReader(bytes.NewReader(zipped))
	if err != nil {
		return nil, fmt.Errorf("error decompressing spec: %w", err)
	}
	var buf bytes.Buffer
	_, err = buf.ReadFrom(zr)
	if err != nil {
		return nil, fmt.Errorf("error decompressing spec: %w", err)
	}

	return buf.Bytes(), nil
}

var rawSpec = decodeSpecCached()

// a naive cached of a decoded swagger spec
func decodeSpecCached() func() ([]byte, error) {
	data, err := decodeSpec()
	return func() ([]byte, error) {
		return data, err
	}
}

// Constructs a synthetic filesystem for resolving external references when loading openapi specifications.
func PathToRawSpec(pathToFile string) map[string]func() ([]byte, error) {
	res := make(map[string]func() ([]byte, error))
	if len(pathToFile) > 0 {
		res[pathToFile] = rawSpec
	}

	return res
}

// GetSwagger returns the Swagger specification corresponding to the generated code
// in this file. The external references of Swagger specification are resolved.
// The logic of resolving external references is tightly connected to "import-mapping" feature.
// Externally referenced files must be embedded in the corresponding golang packages.
// Urls can be supported but this task was out of the scope.
func GetSwagger() (swagger *openapi3.T, err error) {
	resolvePath := PathToRawSpec("")

	loader := openapi3.NewLoader()
	loader.IsExternalRefsAllowed = true
	loader.ReadFromURIFunc = func(loader *openapi3.Loader, url *url.URL) ([]byte, error) {
		pathToFile := url.String()
		pathToFile = path.Clean(pathToFile)
		getSpec, ok := resolvePath[pathToFile]
		if !ok {
			err1 := fmt.Errorf("path not found: %s", pathToFile)
			return nil, err1
		}
		return getSpec()
	}
	var specData []byte
	specData, err = rawSpec()
	if err != nil {
		return
	}
	swagger, err = loader.LoadFromData(specData)
	if err != nil {
		return
	}
	return
}