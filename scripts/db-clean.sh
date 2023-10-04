#!/bin/bash

compose_file="./docker-compose.yaml"

docker compose -f $compose_file down
docker volume rm db_postgres-data
docker compose -f $compose_file up -d