package main

import (
	"database/sql"
	"flag"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

func main() {
	upPtr := flag.Bool("up", false, "a bool")
	downPtr := flag.Bool("down", false, "a bool")

	flag.Parse()

	db, err := sql.Open("postgres", "postgres://postgres:pwd@localhost:5432/database?sslmode=disable")

	if err != nil {
		panic(err)
	}

	driver, err := postgres.WithInstance(db, &postgres.Config{})

	if err != nil {
		panic(err)
	}

	// NOTE: relative path to folder
	m, err := migrate.NewWithDatabaseInstance(
		"file://./schema",
		"postgres", driver,
	)

	if err != nil {
		panic(err)
	}

	if *upPtr {
		err = m.Up()
	} else if *downPtr {
		err = m.Down()
	}

	if err != nil {
		fmt.Println(err)
	}
}
