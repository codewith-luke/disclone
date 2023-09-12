import {Elysia, t} from "elysia";
import {cookie} from '@elysiajs/cookie'
import {getUser} from "./access/user_access";
import {createSessionID, createSignatureToken, passwordMatches} from "./core/auth";
import {saveSession} from "./access/auth_access";
import {ErrorResponseMessage} from "./types";

const LoginRequest = t.Object({
    username: t.String(),
    password: t.String()
});

const ErrorMessages: Record<string, ErrorResponseMessage> = {
    invalidCredentials: {
        status: 401,
        message: "Invalid Credentials"
    }
}

function createErrorResponse(error: ErrorResponseMessage) {
    return {
        status: error.status,
        body: {
            message: error.message
        }
    }
}

export const userHandler = new Elysia()
    .use(cookie())
    .post('/login', async ({setCookie, body}) => {
        // 1) Fetch the user
        let user = await getUser(body.username);

        if (!user || !passwordMatches(body.password, user.password)) {
            return createErrorResponse(ErrorMessages.invalidCredentials);
        }

        // 2) Create/Set the Session and Token
        const sessionID = await createSessionID(user);
        const token = createSignatureToken(user);

        await saveSession(sessionID, token);

        // 4) Set session id cookie
        setCookie('session_id', sessionID);

        // 5) Return user with permissions & token
        return {
            username: user.username,
            permissions: user.permissions,
        }
    }, {
        body: LoginRequest,
    });
