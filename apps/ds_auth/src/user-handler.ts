import {Elysia, t} from "elysia";
import {cookie} from '@elysiajs/cookie'
import {createHttpErrorResponse, ErrorCodes, HttpErrorMessages} from "./error";
import {setup} from "./setup";
import {userAccess} from "./use-cases";

const LoginRequest = t.Object({
    username: t.String(),
    password: t.String()
});

export const userHandler = new Elysia()
    .use(setup)
    .use(cookie())
    .state('userAccess', userAccess)
    // .state('logger', logger)
    .post('/login', async ({logger, store: {userAccess}, setCookie, body}) => {
        logger.info('login')
        const {sessionID, token} = await userAccess.loginUser(body.username, body.password);

        setCookie('session_id', sessionID);

        return {
            username: body.username,
            token,
        }
    }, {
        body: LoginRequest,
        error({code, error}) {
            switch (code) {
                case ErrorCodes.CUSTOM_ERROR:
                    return createHttpErrorResponse(HttpErrorMessages.invalidCredentials, error);
            }
        }
    });
