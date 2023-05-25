package main

import (
	"context"
	"fmt"
	"github.com/clerkinc/clerk-sdk-go/clerk"
	"github.com/codewith-luke/disclone/server/db"
	"net/http"
)

const (
	PROVIDER_CLERK = "clerk"
)

type UserProviderMapping struct {
	ID           int32  `json:"id"`
	ProviderID   string `json:"provider_id"`
	EmailAddress string `json:"email_address"`
	DisplayName  string `json:"display_name"`
}

type ClerkWebhookInput struct {
	Object string           `json:"object" validate:"required"`
	Type   string           `json:"type" validate:"required"`
	Data   ClerkWebhookData `json:"data"`
}

type ClerkWebhookData struct {
	ID                    string                     `json:"id" validate:"required"`
	PrimaryEmailAddressID string                     `json:"primary_email_address_id" validate:"required"`
	EmailAddresses        []ClerkWebhookEmailAddress `json:"email_addresses" validate:"required"`
}

type ClerkWebhookEmailAddress struct {
	ID           string `json:"id" validate:"required"`
	EmailAddress string `json:"email_address" validate:"required email"`
}

type UserProviderConfig struct {
	Validate Validator
	Renderer Renderer
	DB       *DB
}

type UserProvider struct {
	Validate Validator
	Renderer Renderer
	DB       *DB
}

func NewUserProvider(conf UserProviderConfig) *UserProvider {
	return &UserProvider{
		Validate: conf.Validate,
		Renderer: conf.Renderer,
		DB:       conf.DB,
	}
}

func (up *UserProvider) CreateNewUser(r *http.Request, provider string) (*UserProviderMapping, error) {
	switch provider {
	case PROVIDER_CLERK:
		input := ClerkWebhookInput{}
		err := Validate(r, up.Validate, &input)

		if err != nil {
			return nil, err
		}

		var emailAddress string

		for _, address := range input.Data.EmailAddresses {
			if address.ID == input.Data.PrimaryEmailAddressID {
				emailAddress = address.EmailAddress
			}
		}

		if emailAddress == "" {
			return nil, fmt.Errorf("primary email address not found")
		}

		rID, err := up.insert(input.Data.ID, emailAddress)

		return &UserProviderMapping{
			ID:           rID,
			ProviderID:   PROVIDER_CLERK,
			EmailAddress: emailAddress,
		}, nil
	default:
		return nil, fmt.Errorf("provider not found or not implemented yet")
	}
}

func (up *UserProvider) insert(userID string, emailAddress string) (int32, error) {
	user, err := up.DB.Queries.InsertUser(context.Background(), db.InsertUserParams{
		ProviderID:     PROVIDER_CLERK,
		ProviderUserID: userID,
		EmailAddress:   emailAddress,
		DisplayName:    fmt.Sprintf("user_"),
	})

	if err != nil {
		return 0, err
	}

	return user.ID, nil
}

type AuthClient struct {
	client clerk.Client
}

func NewAuthClient(secret string) *AuthClient {
	client, err := clerk.NewClient(secret)

	if err != nil {

		panic(err)
	}

	return &AuthClient{
		client: client,
	}
}

func (ac *AuthClient) VerifyToken(provider string, token string) (*UserSession, error) {
	switch provider {
	case PROVIDER_CLERK:
		customClaims := struct {
			Provider string `json:"provider"`
		}{}

		result, err := ac.client.VerifyToken(token, clerk.WithCustomClaims(&customClaims))
		_, err = ac.client.Users().Read(result.Claims.Subject)

		if err != nil {
			return nil, err
		}

		return &UserSession{
			UserID:   result.Claims.Subject,
			Provider: PROVIDER_CLERK,
		}, err
	default:
		return nil, fmt.Errorf("provider not found or not implemented yet")
	}
}
