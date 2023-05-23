package main

import (
	"github.com/google/uuid"
	"time"
)

type Otp struct {
	Key       string    `json:"key"`
	CreatedAt time.Time `json:"created_at"`
}

type KeyRetention struct {
	Keys map[string]Otp
}

func NewKeyRetention() *KeyRetention {
	kr := &KeyRetention{
		Keys: make(map[string]Otp),
	}
	kr.CleanUp(5 * time.Second)
	return kr
}

func (kr *KeyRetention) Validate(key string) bool {
	if _, ok := kr.Keys[key]; ok {
		kr.Remove(key)
		return ok
	}

	return false
}

func (kr *KeyRetention) CleanUp(interval time.Duration) {
	ticker := time.NewTicker(500 * time.Millisecond)
	done := make(chan struct{})

	go func() {
		for {
			select {
			case <-done:
				return
			case <-ticker.C:
				for _, otp := range kr.Keys {
					if otp.CreatedAt.Add(interval).Before(time.Now()) {
						kr.Remove(otp.Key)
					}
				}
			}
		}
	}()
}

func (kr *KeyRetention) Add(userID string) (string, error) {
	//token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
	//	"iss": "disclone",
	//	"sub": userID,
	//	"nbf": time.Now().Unix(),
	//	"exp": time.Now().Add(time.Minute * 5).Unix(),
	//})

	uuid, err := uuid.NewUUID()

	if err != nil {
		return "", err
	}

	key := uuid.String()

	kr.Keys[key] = Otp{
		Key:       key,
		CreatedAt: time.Now(),
	}

	return key, nil
}

func (kr *KeyRetention) Remove(key string) {
	delete(kr.Keys, key)
}
