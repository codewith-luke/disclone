import {createSessionID, createSignatureToken, hashPassword, passwordMatches, validatePassword} from "../core/auth";
import {IAuthDB} from "../access/db-access";
import {ValidationError} from "../error";

export type RegisterUserInput = {
    email: string;
    username: string;
    password: string;
}

export function createUserAccess(db: IAuthDB, logger: Console) {
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

        try {
            isMatch = await passwordMatches(password, user.password, Bun.env.PASSWORD_PEPPER);
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`User ${username} failed to login: ${e.message}`);
                throw new ValidationError("Invalid username or password");
            }
        }

        if (!user || !isMatch) {
            logger.error(`User ${username} failed to login`);
            throw new ValidationError("Invalid username or password");
        }

        const sessionID = createSessionID();
        const token = createSignatureToken(Bun.env.SECRET, user);

        await db.userAccess.saveSession(sessionID, token);

        logger.info(`User ${username} logged in successfully`);

        return {
            sessionID,
            token
        }
    }
}
