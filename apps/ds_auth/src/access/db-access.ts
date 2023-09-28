import {sleep} from "bun";
import {type RegisterUserInput} from "../use-cases/user-access";
import {type Logger} from "../util/logger";
import {type DB} from "../db";
import {QueryError} from "../util/error";
import {User, UserwithAuth} from "../types";

const DBErrorCodes = {
    UNIQUE_VIOLATION: "23505"
} as const;

type UserAccess = ReturnType<typeof createUserAccess>;

type RegisterUserAccess = {} & RegisterUserInput;

export type AuthDB = ReturnType<typeof createAuthDB>

export function createAuthDB(logger: Logger, db: DB) {
    const userAccess = createUserAccess(logger, db);

    return {
        userAccess
    }
}

function createUserAccess(logger: Logger, db: DB) {
    return {
        getUser,
        getPermissions,
        saveSession,
        deleteSession,
        registerUser
    }

    async function getUser(username: string) {
        logger.info(`db-access: Fetching user ${username}`);
        try {
            const [user] = await db.query`
                select distinct username, *
                from users
                where username = ${username}
            `;

            if (!user) {
                logger.info(`db-access: User ${username} not found`);
                return null;
            }

            logger.info(`db-access: Found user ${user?.username}`);
            return user as User;
        } catch (e) {
            const message = `Failed to get user ${username}`;
            logger.error(message, e);
            throw new QueryError(message);
        }
    }

    async function getPermissions() {
        await sleep(200);
        return ["read", "write"]
    }

    async function saveSession(userID: number, sessionID: string, token: string) {
        try {
            const res = await db.query`
                insert into sessions (user_id, session_id, token)
                values (${userID}, ${sessionID}, ${token})
                on conflict (user_id)
                    do update set token      = ${token},
                                  session_id = ${sessionID}
            `;

            logger.info(`db-access: Created session ${sessionID}`);
            return null
        } catch (e) {
            const message = `db-access: Failed to create session ${sessionID}`;
            logger.error(message, e);
            throw new QueryError(message);
        }
    }

    async function deleteSession(sessionID: string) {
        await sleep(200);
    }

    async function registerUser({email, username, password}: RegisterUserAccess) {
        try {
            await db.query.begin(async sql => {
                const [...users] = await sql<UserwithAuth[]>`
                    select distinct username, email
                    from users
                    where username = ${username}
                       or email = ${email}
                `;

                const keys = getDuplicateKeys(users, {email, username})

                if (keys.size > 0) {
                    throw new QueryError(`This account ${[...keys].join(" or ")} is already in use`);
                }

                await db.query`
                    insert into users (email, username, password)
                    values (${email}, ${username}, ${password})
                `;
            })

            logger.info(`db-access: Registered user ${username}`);
            return null
        } catch (e) {
            if (e instanceof QueryError) {
                throw e;
            }

            const message = `db-access: Failed to register user ${username}`;
            logger.error(message, e);
            throw new QueryError(message);
        }
    }
}

function getDuplicateKeys(users: UserwithAuth[], user: { email: string; username: string }) {
    return users.reduce((acc, usr) => {
        if (usr.username === user.username) {
            acc.add("username");
        }

        if (usr.email === user.email) {
            acc.add("email");
        }

        return acc;
    }, new Set<string>())
}

