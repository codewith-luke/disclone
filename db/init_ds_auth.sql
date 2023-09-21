CREATE USER ds_auth WITH PASSWORD 'password';
CREATE SCHEMA ds_auth AUTHORIZATION ds_auth;

CREATE TABLE ds_auth.users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

create TABLE ds_auth.sessions
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER      NOT NULL UNIQUE REFERENCES ds_auth.users (id),
    session_id VARCHAR(25)  NOT NULL UNIQUE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ds_auth TO ds_auth;

INSERT into ds_auth.users
    (username, password, email)
values ('admin', 'admin', 'admin@localhost');

