package main

import (
	"context"
	"fmt"
	"github.com/codewith-luke/disclone/server/db"
	"github.com/jackc/pgx/v5/pgxpool"
	"sync"
)

type DB struct {
	Queries *db.Queries
	driver  *pgxpool.Pool
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
		pgxDB, err := pgxpool.New(ctx, connString)
		if err != nil {
			panic(err)
		}

		q := db.New(pgxDB)
		pgInstance = &DB{Queries: q, driver: pgxDB}
	})

	return pgInstance
}

func (pg *DB) Ping(ctx context.Context) error {
	return pg.driver.Ping(ctx)
}

func (pg *DB) Close() {
	pg.driver.Close()
}
