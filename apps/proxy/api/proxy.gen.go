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

	// (POST /register)
	Register(ctx echo.Context) error
}

// ServerInterfaceWrapper converts echo contexts to parameters.
type ServerInterfaceWrapper struct {
	Handler ServerInterface
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
	router.POST(baseURL+"/register", wrapper.Register)

}

// Base64 encoded, gzipped, json marshaled Swagger object
var swaggerSpec = []string{

	"H4sIAAAAAAAC/+xZTW/bOBP+KwLfF+hFW7kfuyhU9JBuF9kADdZotqciCBhpLLMrkSo5SmME/u8LUqIk",
	"S6StBHbqoHuzqdF8PDPPkEPdkUQUpeDAUZH4jqhkCQU1P3+XQBFOpajKT/CtAoV6tZSiBIkMjEwBxTVI",
	"85MhFOYHrkogMVEoGc/IOrQLVEq60v85LcAhuA6JhG8Vk5CS+EstFbYWLls94vorJKgV/SGlkGOnwC5v",
	"N1CLufSamMd6EwNIeoLOKFnqXN4nQiGpytTrwiA8lpLQgth53lexHVwDwnnn/e7Eb0p48CilWLAczgqa",
	"uUNUSLFyw1QpkNOKxwTfig+stjZcYW+mYqB2Al5K0QxccFiU/i9hQWLyv6gjXtSwLmper+um07TDp0bQ",
	"65TDm6xdH5beJD9rggw9aZS6/PgoMsa9XQQKynJ3tVClvguZTmCz0dF7Y4sbqhRcwdiPzwrkrtCNzNC4",
	"WfQYFBX6LbJ0Ui27VNtaGbcpwRG4u0k9qIVtazo1y87SiZS0vvlbUqPOFfG8JvE4YgWIjGc7y/bCyjVu",
	"PyjX5sWws+ny9BNkTCHI/Vb8fRqgpUO/B25jRufx45HjAnjaVPHfYvs5w1/TA2NW0G2vK5NBOji9zqGP",
	"+bUQOVA+xrWRdOn/bMq4qVJvKA/fAAeuTN/Tasds+P6i3A8KTZ3c5+zkp8MhThE729k9zhgunjnz4ut4",
	"Ywi1HcYXQnuQgkokK5EJTmLyniqWBCfzs6CU4nYVLIQMPjCV5IJrS8hQd0dil4K5kTqZn5GQ3IBUtZbZ",
	"89nzmQ5VlMBpyUhMXpkl3SJwaUCLugNCBjj25BRQBTTQUT9TQSNsNEqqRfSGoIVO7RPZ9BWj8uVsNiA1",
	"LcucJebV6KvSJuwoMukoomrUNn2svQqsZWIEFrTKcW/G6wHEYbvicFtCgpAGYGXWoYU14vDdUEQoB7b1",
	"3KXhNdIjWHtzGakrEhS+F+lqb2E5Jj9HjOZ5gCKoC5v02YGygvWhs+5N+lHm/I6l62gXodwZt0QyDJW0",
	"ADSj15ehkrMPgVjUOnReFoDJkuhmQmJDbTsQxnXv2kxX2It/IWRBUctx/O01aVsU4wiZ2eIv/0vuKLm9",
	"mXhnjp+pwIr7sn3ePv9pkm5D9ua+weyYa6Ab26cVQSPvr4JW4CcqgybmLXVQSxxPIYSe3VwPOTrhjcc6",
	"N742P56Hji3p+z9q+GdAB+7nHYYKePr4J46nWJi6Q+UiY9x/4vwoMhUw3hzoR3Vpbs0OdNTcuBhcb45Y",
	"h07p5m2gA04DW5fJkCyBps0OfwH4SyLEPww2DcItLUozhl1pMK8UKD13XbH0Hb1OUnjx8tXrX98Gc4rL",
	"d9Hb4E/E8i+erzrKtdPm+kgqR1S4o3REhVtqR79/2Cz2r1jdadQeHhUjy+4uc8KAbaUdh4R5++hgCFsT",
	"jvAax45qG6Z6ExwBWt+BTcB04xbvQF3PeVPoiLCR+EFD9lPKe49TUf9zwARyteIOdl10zw4Gc/dVYhyq",
	"9e0pEsyL6+Z19EEpNrzzdgRpRX4QyZ5W9jXNZPOpyH8osB+TlO9UYAUOlPvh57dHPleOvqU5wLUgHlFq",
	"1yFRIG/spFnJnMRkiVjGUZSLhOZLoTB+M3szi2jJopsXZH25/jcAAP//qHbNmUAkAAA=",
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
