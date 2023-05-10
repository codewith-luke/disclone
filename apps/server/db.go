package main

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"sync"
)

type DB struct {
	Driver *pgxpool.Pool
}

var (
	pgInstance *DB
	pgOnce     sync.Once
)

func NewDB(ctx context.Context) *DB {
	user := GetENVKey("DB_USER")
	pwd := GetENVKey("DB_PWD")
	host := GetENVKey("DB_HOST")
	database := GetENVKey("DB_DATABASE")
	port := GetENVKey("DB_PORT")

	connString := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pwd, host, port, database)

	pgOnce.Do(func() {
		db, err := pgxpool.New(ctx, connString)
		if err != nil {
			panic(err)
		}

		pgInstance = &DB{Driver: db}
	})

	return pgInstance
}

func (pg *DB) Ping(ctx context.Context) error {
	return pg.Driver.Ping(ctx)
}

func (pg *DB) Close() {
	pg.Driver.Close()
}
