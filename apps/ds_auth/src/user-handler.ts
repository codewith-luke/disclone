import {Elysia, t} from "elysia";
import {cookie} from '@elysiajs/cookie'
import {createHttpErrorResponse, ErrorCodes, HttpErrorMessages} from "./error";
import {setup} from "./setup";
import {userAccess} from "./use-cases";
import {Routes, State} from "./types";

const LoginRequest = t.Object({
    username: t.String(),
    password: t.String()
});

export const userHandler = new Elysia()
    .use(setup)
    .use(cookie())
    .state(State.userAccess, userAccess)
    .post(Routes.login, async ({store: {userAccess}, setCookie, body}) => {
        const {sessionID, token} = await userAccess.loginUser(body.username, body.password);

        setCookie('session_id', sessionID);

        return {
            username: body.username,
            token,
        }
    }, {
        body: LoginRequest,
        error({code, error}) {

        }
    });
