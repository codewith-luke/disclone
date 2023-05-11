package main

import (
	"fmt"
	"github.com/spf13/viper"
	"log"
)

func FormatErrorRes(err error) ErrorRes {
	return ErrorRes{
		Message: err.Error(),
	}
}

func GetENVKey(name string) string {
	key, ok := viper.Get(name).(string)

	if !ok {
		err := fmt.Errorf("%s not found", name)
		log.Fatal(err)
	}

	return key
}
