import {
    createSessionID,
    createSignatureToken,
    hashPassword,
    passwordMatches,
    validatePassword,
    validateUsername
} from "../core/auth";
import {AuthDB} from "../access/db-access";
import {ErrorCodes, ValidationError} from "../util/error";
import {Logger} from "../util/logger";

export type RegisterUserInput = {
    email: string;
    username: string;
    password: string;
}

export type UserAccess = ReturnType<typeof createUserAccess>;

export function createUserAccess(db: AuthDB, logger: Logger) {
    return {
        loginUser,
        logoutUser,
        registerUser,
        archive,
        validateAuth
    }

    async function registerUser(data: RegisterUserInput) {
        const passwordErr = validatePassword(data.password);

        if (passwordErr) {
            logger.error(`User ${data.username} failed to register: ${passwordErr.message}`);
            throw new ValidationError(passwordErr.message, ErrorCodes.PARSE);
        }

        const usernameErr = validateUsername(data.username);

        if (usernameErr) {
            logger.error(`User ${data.username} failed to register: ${usernameErr.message}`);
            throw new ValidationError(usernameErr.message, ErrorCodes.PARSE);
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

        await db.userAccess.saveSession(user.id, sessionID, token);

        logger.info(`User ${username} logged in successfully`);

        return {
            user,
            sessionID,
            token
        }
    }

    async function archive(userID: number, sessionID: string) {
        const user = await db.userAccess.userFromSession(sessionID);

        if (user.id !== userID) {
            logger.error(`User failed to archive, user mismatch.`);
            throw new ValidationError("User mismatch");
        }

        await db.userAccess.archive(userID, sessionID);
    }

    async function validateAuth(sessionID: string, token: string) {
        // TODO: Replace with a Redis call
        const user = await db.userAccess.userFromSession(sessionID);

        if (!user) {
            logger.error(`User failed to validate auth, session not found.`);
            return null;
        }

        const isValid = createSignatureToken(Bun.env.SECRET, user) === token;

        if (!isValid) {
            logger.error(`User failed to validate auth, token mismatch.`);
            return null;
        }

        logger.info(`User validated auth successfully.`);

        return user;
    }
}
