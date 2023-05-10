package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/require"
)

// executeRequest, creates a new ResponseRecorder
// then executes the request by calling ServeHTTP in the router
// after which the handler writes the response to the response recorder
// which we can then inspect.
func executeRequest(req *http.Request, s *Server) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	s.Router.ServeHTTP(rr, req)

	return rr
}

// checkResponseCode is a simple utility to check the response code
// of the response
func checkResponseCode(t *testing.T, expected, actual int) {
	if expected != actual {
		t.Errorf("Expected response code %d. Got %d\n", expected, actual)
	}
}

func TestHeartbeat(t *testing.T) {
	bootstrapEnvConfig()
	s := CreateServer()
	s.MountHandlers()

	req, _ := http.NewRequest("GET", "/", nil)

	response := executeRequest(req, s)

	checkResponseCode(t, http.StatusOK, response.Code)

	require.Equal(t, ".", response.Body.String())
}

func TestClerk_No_Body(t *testing.T) {
	s := CreateServer()
	s.MountHandlers()

	req, _ := http.NewRequest("POST", "/webhooks/user/clerk/create", nil)

	response := executeRequest(req, s)
	fmt.Println(req.URL)
	checkResponseCode(t, http.StatusOK, response.Code)

	require.Equal(t, "{\"message\":\"request body is empty\"}", response.Body.String())
}

func TestUserCreate_Not_Implemented(t *testing.T) {
	s := CreateServer()
	s.MountHandlers()

	var buf bytes.Buffer
	json.NewEncoder(&buf).Encode(struct {
	}{})

	req, _ := http.NewRequest("POST", "/webhooks/user/autho/create", &buf)

	actual := executeRequest(req, s)
	checkResponseCode(t, http.StatusOK, actual.Code)

	bodyDecoder := json.NewDecoder(actual.Body)
	expected := struct {
		Message string
	}{
		Message: "provider not found or not implemented yet",
	}

	var result struct{ Message string }
	bodyDecoder.Decode(&result)

	require.Equal(t, expected, result)
}

func TestUserCreate_Success(t *testing.T) {
	s := CreateServer()
	s.MountHandlers()

	var buf bytes.Buffer
	input := ClerkWebhookInput{
		Object: "event",
		Type:   "user.created",
		Data: ClerkWebhookData{
			ID:                    "usr_01",
			PrimaryEmailAddressID: "email_01",
			EmailAddresses: []ClerkWebhookEmailAddress{
				{
					ID:           "email_01",
					EmailAddress: "test@disclone.com",
				},
			},
		},
	}

	json.NewEncoder(&buf).Encode(input)

	req, _ := http.NewRequest("POST", "/webhooks/user/clerk/create", &buf)

	actual := executeRequest(req, s)
	checkResponseCode(t, http.StatusOK, actual.Code)

	bodyDecoder := json.NewDecoder(actual.Body)
	var result ClerkWebhookInput
	bodyDecoder.Decode(&result)

	require.Equal(t, input, result)
}
