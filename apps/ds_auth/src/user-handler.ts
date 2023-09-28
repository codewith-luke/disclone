import {Elysia, t} from "elysia";
import {setup} from "./setup";
import {Cookies, Routes, State} from "./types";
import {ErrorCodes, ValidationError} from "./util/error";
import {UserAccess} from "./use-cases/user-access";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv, ["email", "time", "uri"])
    .addKeyword("kind")
    .addKeyword("modifier");
addErrors(ajv);

const LoginRequest = t.Object({
    username: t.String(),
    password: t.String(),
});

const RegisterRequest = t.Object({
    email: t.String({
        format: "email",
        default: "user@email.com"
    }),
    username: t.String({
        minLength: 3,
        maxLength: 64,
        pattern: "^[a-z0-9]+$",
        errorMessage: {format: "Username can only contain lowercase letters and numbers"},
    }),
    password: t.String({
        minLength: 8,
        maxLength: 64,
        errorMessage: {format: "Password must be at least 8 characters long"},
    }),
});

const validate = ajv.compile(RegisterRequest);

export function createUserHandler(userAccess: UserAccess) {
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
