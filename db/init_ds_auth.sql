SET
TIMEZONE TO 'Europe/London';

CREATE
USER ds_auth WITH PASSWORD 'password';
CREATE SCHEMA ds_auth AUTHORIZATION ds_auth;

CREATE TABLE ds_auth.users
(
    id           SERIAL PRIMARY KEY,
    username     VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    password     VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    archived     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

create TABLE ds_auth.sessions
(
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER      NOT NULL UNIQUE REFERENCES ds_auth.users (id),
    session_id VARCHAR(25)  NOT NULL UNIQUE,
    token      VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);


GRANT
ALL
PRIVILEGES
ON
ALL
TABLES IN SCHEMA ds_auth TO ds_auth;
GRANT USAGE,
SELECT
ON ALL SEQUENCES IN SCHEMA ds_auth TO ds_auth;

CREATE
OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at
= now();
RETURN NEW;
END;
$$
language 'plpgsql';

CREATE TRIGGER update_modified_time_sessions
    BEFORE UPDATE
    ON ds_auth.sessions
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_modified_time_users
    BEFORE UPDATE
    ON ds_auth.users
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

INSERT into ds_auth.users
    (username, display_name, password, email)
values ('admin',
        'IAmAdmin',
        '$argon2id$v=19$m=65536,t=2,p=1$l8dOxo5QkVOiKKa+QNpEGNTgUkCrGrzj2CXFZ5xhPYs$0jyFFb643s0c/f2OsZ1gddtLXFxR4tqArkMUpN9xUwk',
        'admin@localhost.com');


