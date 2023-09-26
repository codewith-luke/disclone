import {createSessionID, createSignatureToken, hashPassword, passwordMatches, validatePassword} from "../core/auth";
import {IAuthDB} from "../access/db-access";
import {ValidationError} from "../error";
import {Logger} from "../logger";

export type RegisterUserInput = {
    email: string;
    username: string;
    password: string;
}

export function createUserAccess(db: IAuthDB, logger: Logger) {
    return {
        loginUser,
        logoutUser,
        registerUser
    }

    async function registerUser(data: RegisterUserInput) {
        try {
            validatePassword(data.password);
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`User ${data.username} failed to register: ${e.message}`);
                throw new ValidationError(e.message);
            }
        }

        await db.userAccess.registerUser({
            ...data,
            password: await hashPassword(data.password, Bun.env.PASSWORD_PEPPER)
        });

        return await loginUser(data.username, data.password);
    }

    async function logoutUser(sessionID: string) {
        await db.userAccess.deleteSession(sessionID);

        logger.info(`User logged out successfully`);
    }

    async function loginUser(username: string, password: string) {
        let user = await db.userAccess.getUser(username);
        let isMatch = false;

        if (!user) {
            logger.error(`User ${username} failed to login, no user found.`);
            return null;
        }

        try {
            isMatch = await passwordMatches(password, user.password, Bun.env.PASSWORD_PEPPER);
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`User password match failed: ${e.message}`);
                return null;
            }
        }

        if (!isMatch) {
            logger.error(`User ${username} failed to login, password mismatch.`);
            return null;
        }

        const sessionID = createSessionID();
        const token = createSignatureToken(Bun.env.SECRET, user);

        if (!sessionID) {
            logger.error(`User ${username} failed to login, session creation failed.`);
            return null;
        }

        if (!token) {
            logger.error(`User ${username} failed to login, token creation failed.`);
            return null;
        }

        await db.userAccess.saveSession(sessionID, token);

        logger.info(`User ${username} logged in successfully`);

        return {
            sessionID,
            token
        }
    }
}
