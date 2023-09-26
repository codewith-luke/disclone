import {sleep} from "bun";
import {type RegisterUserInput} from "../use-cases/user-access";
import {type Logger} from "../logger";
import {type DB} from "../db";
import {QueryError} from "../error";
import {User} from "../types";

type UserAccess = ReturnType<typeof createUserAccess>;

type RegisterUserAccess = {} & RegisterUserInput;

export interface IAuthDB {
    userAccess: UserAccess;
}

export default class AuthDB implements IAuthDB {
    public readonly userAccess;

    constructor(logger: Logger, db: DB) {
        this.userAccess = createUserAccess(logger, db);
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
        logger.info(`Fetching user ${username}`);
        try {
            const [user] = await db.query`
                select distinct username, *
                from users
                where username = ${username}
            `;

            if (!user) {
                logger.info(`User ${username} not found`);
                return null;
            }

            logger.info(`Found user ${user?.username}`);
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

    async function saveSession(sessionID: string, token: string) {
        await sleep(200);
    }

    async function deleteSession(sessionID: string) {
        await sleep(200);
    }

    async function registerUser({email, username, password}: RegisterUserAccess) {
        await sleep(200);
    }
}

