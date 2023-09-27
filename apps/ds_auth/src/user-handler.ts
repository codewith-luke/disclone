import {Elysia, t} from "elysia";
import {setup} from "./setup";
import {Cookies, Routes, State} from "./types";
import {ErrorCodes, ValidationError} from "./util/error";

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

export function createUserHandler(userAccess: any) {
    return new Elysia()
        .use(setup)
        .state(State.userAccess, userAccess)
        .post(Routes.register, async ({store: {userAccess}, body}) => {
            await userAccess.registerUser(body);
            return {}
        }, {
            body: RegisterRequest
        })
        .post(Routes.login, async ({store: {userAccess}, setCookie, body, set}) => {
            const result = await userAccess.loginUser(body.username, body.password);

            if (!result) {
                const error = new ValidationError().createHttpResponse();
                set.status = error.status;
                return error;
            }

            const {sessionID, token} = result;

            setCookie(Cookies.sessionID, sessionID);

            return {
                username: body.username,
                token,
            }
        }, {
            body: LoginRequest,
            error({code, error}) {
                switch (code) {
                    case ErrorCodes.QUERY_ERROR: {
                        return error.createHttpResponse();
                    }
                }
            }
        })
        .post(Routes.logout, async ({cookie, store: {userAccess}, removeCookie, setCookie}) => {
            await userAccess.logoutUser(cookie[Cookies.sessionID]);
            removeCookie(Cookies.sessionID);
        }, {
            body: t.Undefined()
        });
}
