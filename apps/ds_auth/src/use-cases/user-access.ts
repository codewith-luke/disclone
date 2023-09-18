import {createSessionID, createSignatureToken, hashPassword, passwordMatches} from "../core/auth";
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
        await db.userAccess.registerUser({
            ...data,
            password: await hashPassword(data.password)
        });
        return await loginUser(data.username, data.password);
    }

    async function logoutUser(sessionID: string) {
        await db.userAccess.deleteSession(sessionID);

        logger.info(`User logged out successfully`);
    }

    async function loginUser(username: string, password: string) {
        let user = await db.userAccess.getUser(username);

        if (!user || !await passwordMatches(password, user.password)) {
            logger.error(`User ${username} failed to login`);
            throw new ValidationError();
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
