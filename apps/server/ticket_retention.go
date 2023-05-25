package main

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"time"
)

// TODO: Make this a env variable
var secret = []byte("secret")

type Ticket struct {
	Value     string    `json:"key"`
	CreatedAt time.Time `json:"created_at"`
}

type TicketClaims struct {
	ID string `json:"ID"`
	jwt.MapClaims
}

type TicketRetention struct {
	Keys map[string]Ticket
}

func NewTicketRetention() *TicketRetention {
	kr := &TicketRetention{
		Keys: make(map[string]Ticket),
	}
	kr.CleanUp(5 * time.Second)
	return kr
}

func (tr *TicketRetention) Validate(tokenString string) (*TicketClaims, bool) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return secret, nil
	})

	if err != nil {
		return nil, false
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		ticketClaims := TicketClaims{
			ID:        claims["id"].(string),
			MapClaims: claims,
		}

		if _, ok := tr.Keys[ticketClaims.ID]; ok {
			tr.Remove(ticketClaims.ID)
			return &ticketClaims, true
		}
	}

	return nil, false
}

func (tr *TicketRetention) Add(userID string) (string, error) {
	uuid, err := uuid.NewUUID()
	key := uuid.String()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss": "disclone",
		"id":  key,
		"sub": userID,
		"nbf": time.Now().Unix(),
		"exp": time.Now().Add(time.Minute * 5).Unix(),
	})

	tokenString, err := token.SignedString(secret)

	if err != nil {
		return "", err
	}

	tr.Keys[key] = Ticket{
		Value:     tokenString,
		CreatedAt: time.Now(),
	}

	return tokenString, nil
}

func (tr *TicketRetention) Remove(key string) {
	delete(tr.Keys, key)
}

func (tr *TicketRetention) CleanUp(interval time.Duration) {
	ticker := time.NewTicker(500 * time.Millisecond)
	done := make(chan struct{})

	go func() {
		for {
			select {
			case <-done:
				return
			case <-ticker.C:
				for _, otp := range tr.Keys {
					if otp.CreatedAt.Add(interval).Before(time.Now()) {
						tr.Remove(otp.Value)
					}
				}
			}
		}
	}()
}
