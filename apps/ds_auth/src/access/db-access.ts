import {type RegisterUserInput} from "../use-cases/user-access";
import {type Logger} from "../util/logger";
import {type DB} from "../db";
import {QueryError} from "../util/error";
import {User, UserUpdateFields} from "../types";

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
        registerUser,
        archive,
        sessionByUserID,
        userFromSession,
        updateUser
    }

    async function getUser(username: string) {
        logger.info(`db-access: Fetching user ${username}`);

        try {
            const [user] = await db.query<User[]>`
                select distinct username, *
                from users
                where username = ${username}
            `;

            if (!user) {
                logger.info(`db-access: User ${username} not found`);
                return null;
            }

            logger.info(`db-access: Found user ${user?.username}`);

            return user;
        } catch (e) {
            const message = `Failed to get user ${username}`;
            handleDBError(e, logger, message);
        }
    }

    async function getPermissions() {
        return ["read", "write"]
    }

    async function updateUser(userID: number, data: Partial<UserUpdateFields>) {
        const keys = Object.keys(data) as (keyof Partial<UserUpdateFields>)[];

        if (keys.length === 0) {
            return;
        }

        try {
            await db.query`
                update users
                set ${db.query(data, ...keys)}
                where id = ${userID}
            `
        } catch (e) {
            const message = `Failed to update user ${userID}`;
            handleDBError(e, logger, message);
        }
    }

    async function saveSession(userID: number, sessionID: string, token: string) {
        try {
            await db.query`
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
            handleDBError(e, logger, message);
        }
    }

    async function deleteSession(sessionID: string) {
        try {
            await db.query`
                delete
                from sessions
                where session_id = ${sessionID}
            `;

            logger.info(`db-access: Deleted session ${sessionID}`);
            return null
        } catch (e) {
            const message = `db-access: Failed to delete session ${sessionID}`;
            handleDBError(e, logger, message);
        }
    }

    async function registerUser({email, username, password, display_name}: RegisterUserAccess) {
        try {
            await db.query.begin(async sql => {
                const [...users] = await sql<User[]>`
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
                    insert into users (email, username, password, display_name)
                    values (${email}, ${username}, ${password}, ${display_name})
                `;
            })

            logger.info(`db-access: Registered user ${username}`);
            return null
        } catch (e) {
            if (e instanceof QueryError) {
                handleDBError(e, logger, "");
            }

            const message = `db-access: Failed to register user ${username}`;
            handleDBError(e, logger, message)
        }
    }

    async function archive(userID: number, sessionID: string) {
        try {
            await db.query.begin(async sql => {
                await sql`
                    update users
                    set archived = true
                    where id in (select user_id
                                 from sessions
                                 where session_id = ${sessionID})
                `;

                await sql`
                    delete
                    from sessions
                    where session_id = ${sessionID}
                `;
            })
        } catch (e) {
            const message = `Failed to archive user ${userID}`;
            handleDBError(e, logger, message);
        }
    }

    async function sessionByUserID(userID: number) {
        try {
            const [session] = await db.query`
                select distinct *
                from sessions
                where user_id = ${userID}
            `;

            return session;
        } catch (e) {
            const message = `Failed to get session for user ${userID}`;
            handleDBError(e, logger, message);
        }
    }

    async function userFromSession(sessionID: string) {
        try {
            const [user] = await db.query<User[]>`
                select distinct u.*
                from users u
                         join sessions s on u.id = s.user_id
                where s.session_id = ${sessionID}
            `;

            return user;
        } catch (e) {
            const message = `Failed to get user for session ${sessionID}`;
            handleDBError(e, logger, message);
        }
    }
}

function getDuplicateKeys(users: User[], user: { email: string; username: string }) {
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

function handleDBError(e: any, logger: Logger, message: string) {
    let errMessage = "";

    if (e instanceof Error) {
        errMessage = e.message;
    }

    logger.error(`${message} : ${errMessage}`);

    throw new QueryError(message);
}

