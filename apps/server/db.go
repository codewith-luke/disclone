package main

import (
	"database/sql"
	"fmt"
	"github.com/golang-migrate/migrate/v4/database"
	"github.com/golang-migrate/migrate/v4/database/postgres"
)

type DB struct {
	Driver database.Driver
}

func NewDB() *DB {
	user := GetENVKey("DB_USER")
	pwd := GetENVKey("DB_PWD")
	host := GetENVKey("DB_HOST")
	database := GetENVKey("DB_DATABASE")
	port := GetENVKey("DB_PORT")

	con := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pwd, host, port, database)
	db, err := sql.Open("postgres", con)

	if err != nil {
		panic(err)
	}

	driver, err := postgres.WithInstance(db, &postgres.Config{})

	if err != nil {
		panic(err)
	}

	return &DB{
		Driver: driver,
	}
}
