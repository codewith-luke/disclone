import {Elysia, t} from "elysia";
import {cookie} from '@elysiajs/cookie'
import {ErrorResponseMessage} from "./types";
import {userAccess} from "./use-cases";

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
    .state('userAccess', userAccess)
    .use(cookie())
    .post('/login', async ({store: {userAccess}, setCookie, body}) => {
        try {
            const {sessionID, token} = await userAccess.loginUser(body.username, body.password);

            setCookie('session_id', sessionID);

            return {
                username: body.username,
                token,
            }
        } catch (e) {
            return createErrorResponse(ErrorMessages.invalidCredentials);
        }

    }, {
        body: LoginRequest,
    });
