import {Elysia, t} from "elysia";
import {setupLogger, setupRoutes} from "./setup";
import {Cookies, ErrorResponseMessage, Routes, State, User} from "./types";
import {ErrorCodes, ValidationError} from "./util/error";
import {UserAccess} from "./use-cases/user-access";
import jwt from "@elysiajs/jwt";

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

export const LoginResponse = t.Object({
    user: t.Omit(User, ['password', 'permissions'])
});

export function createUserHandler(userAccess: UserAccess) {
    const AuthRoutes = new Elysia()
        .use(setupLogger)
        .use(setupRoutes)
        .derive(({cookie, set}) => ({
            validateAuth: async () => {
                const sessionID = cookie[Cookies.sessionID];
                const token = cookie[Cookies.sessionToken];

                if (!sessionID || !token) {
                    set.status = 401;
                    return false;
                }

                const user = await userAccess.validateAuth(sessionID, token);

                if (!user) {
                    set.status = 401;
                    return false;
                }
            }
        }))
        .guard({},
            app => app
                .onBeforeHandle(({validateAuth, logger}) => {
                    logger.info('validating auth');
                    validateAuth();
                    logger.info('auth validated');
                })
                .put(Routes.archive, async ({body, removeCookie, cookie}) => {
                    const sessionID = cookie[Cookies.sessionID];
                    await userAccess.archive(body.userID, sessionID);

                    removeCookie(Cookies.sessionID);
                    removeCookie(Cookies.sessionToken);

                    return {
                        userID: body.userID
                    }
                }, {
                    body: ArchiveRequest
                })
        );

    return new Elysia()
        .use(
            jwt({
                name: 'jwt',
                secret: 'Fischl von Luftschloss Narfidort'
            })
        )
        .model({
            login: LoginResponse,
            errorResponse: ErrorResponseMessage,
        })
        .use(setupRoutes)
        .state(State.userAccess, userAccess)
        .use(AuthRoutes)
        .post(Routes.logout, async ({cookie, store: {userAccess}, removeCookie}) => {
            await userAccess.logoutUser(cookie[Cookies.sessionID]);

            removeCookie(Cookies.sessionID);
            removeCookie(Cookies.sessionToken);

            return {
                success: true
            }
        }, {
            body: t.Undefined()
        })
        .post(Routes.register, async ({store: {userAccess}, setCookie, set, body}) => {
            const result = await userAccess.registerUser(body);

            if (!result) {
                const error = new ValidationError().createHttpResponse();
                set.status = error.status;
                return error;
            }

            const {sessionID, token} = result;

            setCookie(Cookies.sessionID, sessionID);
            setCookie(Cookies.sessionToken, token);

            return {
                user: User.toJSON(result.user),
            }
        }, {
            body: RegisterRequest
        })
        .post(Routes.login, async ({store: {userAccess}, jwt, params, setCookie, body, set}) => {
            const result = await userAccess.loginUser(body.username, body.password);

            if (!result) {
                const error = new ValidationError().createHttpResponse();
                set.status = error.status;
                return error;
            }

            const {sessionID, token} = result;

            setCookie(Cookies.sessionID, sessionID);
            setCookie(Cookies.sessionToken, token);
            setCookie('auth', await jwt.sign(params), {
                httpOnly: true,
                maxAge: 7 * 86400,
            })

            return {
                user: User.toJSON(result.user),
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
}
