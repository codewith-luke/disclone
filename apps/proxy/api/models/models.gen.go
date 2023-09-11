// Package models provides primitives to interact with the openapi HTTP API.
//
// Code generated by github.com/deepmap/oapi-codegen version v1.13.4 DO NOT EDIT.
package models

import (
	"encoding/json"

	"github.com/deepmap/oapi-codegen/pkg/runtime"
)

// AnyValue defines model for AnyValue.
type AnyValue struct {
	union json.RawMessage
}

// AnyValue0 defines model for .
type AnyValue0 = string

// AnyValue1 defines model for .
type AnyValue1 = float32

// AnyValue2 defines model for .
type AnyValue2 = int

// AnyValue3 defines model for .
type AnyValue3 = bool

// AnyValue4 defines model for .
type AnyValue4 = []interface{}

// AnyValue5 defines model for .
type AnyValue5 = map[string]interface{}

// CreateGroupRequest defines model for CreateGroupRequest.
type CreateGroupRequest struct {
	Members []string `json:"members"`
	Name    string   `json:"name"`
}

// Error defines model for Error.
type Error struct {
	Error string `json:"error"`
}

// Group defines model for Group.
type Group struct {
	CreatedAt string   `json:"createdAt"`
	Id        string   `json:"id"`
	Members   []string `json:"members"`
	Name      string   `json:"name"`
	UpdatedAt string   `json:"updatedAt"`
}

// GroupMembers defines model for GroupMembers.
type GroupMembers struct {
	Members []struct {
		Id           string `json:"id"`
		ProfileImage string `json:"profileImage"`
		Status       string `json:"status"`
		Username     string `json:"username"`
	} `json:"members"`
}

// GroupMessages defines model for GroupMessages.
type GroupMessages struct {
	Messages []Message `json:"messages"`
}

// Groups defines model for Groups.
type Groups struct {
	Groups []Group `json:"groups"`
}

// LoginRequest defines model for LoginRequest.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse defines model for LoginResponse.
type LoginResponse struct {
	User User `json:"User"`
}

// LogoutResponse defines model for LogoutResponse.
type LogoutResponse struct {
	Id string `json:"id"`
}

// Message defines model for Message.
type Message struct {
	Content   string `json:"content"`
	CreatedAt string `json:"createdAt"`
	Id        string `json:"id"`
	UpdatedAt string `json:"updatedAt"`
	UserId    string `json:"userId"`
}

// Profile defines model for Profile.
type Profile struct {
	Settings Settings `json:"settings"`
	User     User     `json:"user"`
}

// RegisterRequest defines model for RegisterRequest.
type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Username string `json:"username"`
}

// RegisterResponse defines model for RegisterResponse.
type RegisterResponse struct {
	User User `json:"User"`
}

// SendMessageToGroupRequest defines model for SendMessageToGroupRequest.
type SendMessageToGroupRequest struct {
	Content string `json:"content"`
}

// Settings defines model for Settings.
type Settings struct {
	Enabled bool `json:"enabled"`
}

// UpdateProfileRequest defines model for UpdateProfileRequest.
type UpdateProfileRequest struct {
	ProfileImage string `json:"profileImage"`
	Status       string `json:"status"`
}

// UpdateSettingsRequest defines model for UpdateSettingsRequest.
type UpdateSettingsRequest struct {
	Enabled bool `json:"enabled"`
}

// User defines model for User.
type User struct {
	CreatedAt    string `json:"createdAt"`
	Email        string `json:"email"`
	Id           string `json:"id"`
	ProfileImage string `json:"profileImage"`
	Status       string `json:"status"`
	UpdatedAt    string `json:"updatedAt"`
	Username     string `json:"username"`
}

// CreateGroupJSONRequestBody defines body for CreateGroup for application/json ContentType.
type CreateGroupJSONRequestBody = CreateGroupRequest

// SendMessageToGroupJSONRequestBody defines body for SendMessageToGroup for application/json ContentType.
type SendMessageToGroupJSONRequestBody = SendMessageToGroupRequest

// LoginJSONRequestBody defines body for Login for application/json ContentType.
type LoginJSONRequestBody = LoginRequest

// UpdateProfileJSONRequestBody defines body for UpdateProfile for application/json ContentType.
type UpdateProfileJSONRequestBody = UpdateProfileRequest

// UpdateSettingsJSONRequestBody defines body for UpdateSettings for application/json ContentType.
type UpdateSettingsJSONRequestBody = UpdateSettingsRequest

// RegisterJSONRequestBody defines body for Register for application/json ContentType.
type RegisterJSONRequestBody = RegisterRequest

// AsAnyValue0 returns the union data inside the AnyValue as a AnyValue0
func (t AnyValue) AsAnyValue0() (AnyValue0, error) {
	var body AnyValue0
	err := json.Unmarshal(t.union, &body)
	return body, err
}

// FromAnyValue0 overwrites any union data inside the AnyValue as the provided AnyValue0
func (t *AnyValue) FromAnyValue0(v AnyValue0) error {
	b, err := json.Marshal(v)
	t.union = b
	return err
}

// MergeAnyValue0 performs a merge with any union data inside the AnyValue, using the provided AnyValue0
func (t *AnyValue) MergeAnyValue0(v AnyValue0) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}

	merged, err := runtime.JsonMerge(t.union, b)
	t.union = merged
	return err
}

// AsAnyValue1 returns the union data inside the AnyValue as a AnyValue1
func (t AnyValue) AsAnyValue1() (AnyValue1, error) {
	var body AnyValue1
	err := json.Unmarshal(t.union, &body)
	return body, err
}

// FromAnyValue1 overwrites any union data inside the AnyValue as the provided AnyValue1
func (t *AnyValue) FromAnyValue1(v AnyValue1) error {
	b, err := json.Marshal(v)
	t.union = b
	return err
}

// MergeAnyValue1 performs a merge with any union data inside the AnyValue, using the provided AnyValue1
func (t *AnyValue) MergeAnyValue1(v AnyValue1) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}

	merged, err := runtime.JsonMerge(t.union, b)
	t.union = merged
	return err
}

// AsAnyValue2 returns the union data inside the AnyValue as a AnyValue2
func (t AnyValue) AsAnyValue2() (AnyValue2, error) {
	var body AnyValue2
	err := json.Unmarshal(t.union, &body)
	return body, err
}

// FromAnyValue2 overwrites any union data inside the AnyValue as the provided AnyValue2
func (t *AnyValue) FromAnyValue2(v AnyValue2) error {
	b, err := json.Marshal(v)
	t.union = b
	return err
}

// MergeAnyValue2 performs a merge with any union data inside the AnyValue, using the provided AnyValue2
func (t *AnyValue) MergeAnyValue2(v AnyValue2) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}

	merged, err := runtime.JsonMerge(t.union, b)
	t.union = merged
	return err
}

// AsAnyValue3 returns the union data inside the AnyValue as a AnyValue3
func (t AnyValue) AsAnyValue3() (AnyValue3, error) {
	var body AnyValue3
	err := json.Unmarshal(t.union, &body)
	return body, err
}

// FromAnyValue3 overwrites any union data inside the AnyValue as the provided AnyValue3
func (t *AnyValue) FromAnyValue3(v AnyValue3) error {
	b, err := json.Marshal(v)
	t.union = b
	return err
}

// MergeAnyValue3 performs a merge with any union data inside the AnyValue, using the provided AnyValue3
func (t *AnyValue) MergeAnyValue3(v AnyValue3) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}

	merged, err := runtime.JsonMerge(t.union, b)
	t.union = merged
	return err
}

// AsAnyValue4 returns the union data inside the AnyValue as a AnyValue4
func (t AnyValue) AsAnyValue4() (AnyValue4, error) {
	var body AnyValue4
	err := json.Unmarshal(t.union, &body)
	return body, err
}

// FromAnyValue4 overwrites any union data inside the AnyValue as the provided AnyValue4
func (t *AnyValue) FromAnyValue4(v AnyValue4) error {
	b, err := json.Marshal(v)
	t.union = b
	return err
}

// MergeAnyValue4 performs a merge with any union data inside the AnyValue, using the provided AnyValue4
func (t *AnyValue) MergeAnyValue4(v AnyValue4) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}

	merged, err := runtime.JsonMerge(t.union, b)
	t.union = merged
	return err
}

// AsAnyValue5 returns the union data inside the AnyValue as a AnyValue5
func (t AnyValue) AsAnyValue5() (AnyValue5, error) {
	var body AnyValue5
	err := json.Unmarshal(t.union, &body)
	return body, err
}

// FromAnyValue5 overwrites any union data inside the AnyValue as the provided AnyValue5
func (t *AnyValue) FromAnyValue5(v AnyValue5) error {
	b, err := json.Marshal(v)
	t.union = b
	return err
}

// MergeAnyValue5 performs a merge with any union data inside the AnyValue, using the provided AnyValue5
func (t *AnyValue) MergeAnyValue5(v AnyValue5) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}

	merged, err := runtime.JsonMerge(t.union, b)
	t.union = merged
	return err
}

func (t AnyValue) MarshalJSON() ([]byte, error) {
	b, err := t.union.MarshalJSON()
	return b, err
}

func (t *AnyValue) UnmarshalJSON(b []byte) error {
	err := t.union.UnmarshalJSON(b)
	return err
}