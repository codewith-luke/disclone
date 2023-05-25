CREATE TABLE "user_provider_mapping"
(
    id               SERIAL PRIMARY KEY,
    provider_id      VARCHAR(255) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    email_address    VARCHAR(255) NOT NULL,
    display_name     VARCHAR(255) NOT NULL
);

-- name: GetUser :one
SELECT *
FROM "user_provider_mapping"
WHERE provider_user_id = $1
LIMIT 1;


-- name: InsertUser :one
INSERT INTO user_provider_mapping (provider_id, provider_user_id, email_address, display_name)
values (sqlc.arg('provider_id'), sqlc.arg('provider_user_id'), sqlc.arg('email_address'), sqlc.arg('display_name'))
RETURNING id, email_address;