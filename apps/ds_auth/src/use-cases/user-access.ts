import {
    createSessionID,
    createSignatureToken,
    hashPassword,
    passwordMatches,
    validatePassword,
    validateUsername
} from "../core/auth";
import {AuthDB} from "../access/db-access";
import {BadRequestError, ErrorCodes, QueryError, ValidationError} from "../util/error";
import {Logger} from "../util/logger";
import {JWTProfile, User, UserUpdateFields} from "../types";

export type RegisterUserInput = {
    email: string;
    username: string;
    password: string;
    display_name: string;
}

export type UserAccess = ReturnType<typeof createUserAccess>;

export function createUserAccess(db: AuthDB, logger: Logger) {
    return {
        getUserBySession,
        loginUser,
        logoutUser,
        registerUser,
        archive,
        validateSession,
        saveUserSession,
        updateUser
    }

    async function getUserBySession(sessionID: string) {
        return db.userAccess.userFromSession(sessionID);
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

    async function updateUser(userID: number, data: Partial<UserUpdateFields>) {
        const isEmpty = Object.values(data).every(v => v === undefined);

        if (isEmpty) {
            logger.error(`User ${userID} failed to update, no data provided.`);
            throw new BadRequestError("No data provided");
        }

        await db.userAccess.updateUser(userID, data);
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

        if (!sessionID) {
            logger.error(`User ${username} failed to login, session creation failed.`);
            return null;
        }


        logger.info(`User ${username} logged in successfully`);

        return {
            user,
            sessionID
        }
    }

    async function saveUserSession(userID: number, sessionID: string, token: string) {
        await db.userAccess.saveSession(userID, sessionID, token);
        logger.info(`User ${userID} session saved successfully`);
    }

    async function archive(userID: number, sessionID: string) {
        const user = await db.userAccess.userFromSession(sessionID);

        if (user?.id !== userID) {
            logger.error(`User failed to archive, user mismatch.`);
            throw new ValidationError("User mismatch");
        }

        await db.userAccess.archive(userID, sessionID);
    }

    async function validateSession(sessionID: string, token: JWTProfile) {
        // TODO: Replace with a Redis call
        const user = await db.userAccess.userFromSession(sessionID);

        if (!user) {
            logger.error(`User failed to validate auth, session not found.`);
            return null;
        }

        if (user.id !== parseInt(token.id)) {
            logger.error(`User failed to validate auth, user mismatch.`);
            return null;
        }

        logger.info(`User validated auth successfully.`);

        return user;
    }
}
