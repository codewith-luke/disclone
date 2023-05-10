package main

import (
	"database/sql"
	"flag"
	"fmt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
	"os"
)

func main() {
	upPtr := flag.Bool("up", false, "a bool")
	downPtr := flag.Bool("down", false, "a bool")
	flag.Parse()

	user := os.Getenv("DB_USER")
	pwd := os.Getenv("DB_PWD")
	host := os.Getenv("DB_HOST")
	database := os.Getenv("DB_DATABASE")
	port := os.Getenv("DB_PORT")

	con := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", user, pwd, host, port, database)
	db, err := sql.Open("postgres", con)

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

	if *upPtr && *downPtr {
		panic("Cannot specify both up and down")
	}

	if !*upPtr && !*downPtr {
		panic("Must specify either up or down")
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
