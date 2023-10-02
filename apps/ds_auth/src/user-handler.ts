import {Elysia, t} from "elysia";
import {setup} from "./setup";
import {Cookies, Routes, State} from "./types";
import {ErrorCodes, ValidationError} from "./util/error";
import {UserAccess} from "./use-cases/user-access";

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
        default: "Username must be at least 3 characters long",
        examples: "Username must be at least 3 characters long"
    }),
    password: t.String({
        minLength: 8,
        maxLength: 64,
        errorMessage: {format: "Password must be at least 8 characters long"},
    }),
});

const ArchiveRequest = t.Object({
    userID: t.Number(),
});

export function createUserHandler(userAccess: UserAccess) {
    return new Elysia()
        .use(setup)
        // TODO: implement Guard to validate sessionID && token
        .state(State.userAccess, userAccess)
        .post(Routes.register, async ({store: {userAccess}, setCookie, set, body}) => {
            const result = await userAccess.registerUser(body);

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
        .post(Routes.logout, async ({cookie, store: {userAccess}, removeCookie}) => {
            await userAccess.logoutUser(cookie[Cookies.sessionID]);
            removeCookie(Cookies.sessionID);
        }, {
            body: t.Undefined()
        })
        .put(Routes.archive, async ({body, removeCookie}) => {
            await userAccess.archive(body.userID);
            removeCookie(Cookies.sessionID);

            return {
                userID: body.userID
            }
        }, {
            body: ArchiveRequest
        });
}
