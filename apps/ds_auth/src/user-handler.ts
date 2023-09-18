import {Elysia, t} from "elysia";
import {setup} from "./setup";
import {userAccess} from "./use-cases";
import {Cookies, Routes, State} from "./types";

const LoginRequest = t.Object({
    username: t.String(),
    password: t.String()
});

const RegisterRequest = t.Object({
    email: t.String({
        format: "email",
        default: "user@email.com"
    }),
    username: t.String(),
    password: t.String(),
});

export const userHandler = new Elysia()
    .use(setup)
    .state(State.userAccess, userAccess)
    .post(Routes.register, async ({store: {userAccess}, body}) => {
        await userAccess.registerUser(body);
        return {}
    }, {
        body: RegisterRequest
    })
    .post(Routes.login, async ({store: {userAccess}, setCookie, body}) => {

        const {sessionID, token} = await userAccess.loginUser(body.username, body.password);

        setCookie(Cookies.sessionID, sessionID);

        return {
            username: body.username,
            token,
        }
    }, {
        body: LoginRequest
    })
    .post(Routes.logout, async ({cookie, store: {userAccess}, removeCookie}) => {
        await userAccess.logoutUser(cookie[Cookies.sessionID]);
        removeCookie(Cookies.sessionID);
    }, {
        body: t.Undefined()
    });
