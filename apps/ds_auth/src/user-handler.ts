import {Elysia, t} from "elysia";
import {setupLogger, setupRoutes} from "./setup";
import {
    Cookies,
    ErrorResponseMessage,
    JWTProfile,
    JWTSign,
    RemoveCookie,
    Routes,
    SetCookie,
    State,
    User
} from "./types";
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
    display_name: t.String({
        minLength: 3,
        maxLength: 20,
    }),
});

const ArchiveRequest = t.Object({
    userID: t.Number(),
});

export const ProfileUpdateRequest = t.Object({
    display_name: t.Optional(t.String()),
});

export const LoginResponse = t.Object({
    user: t.Omit(User, ['password', 'permissions'])
});

async function signToken(userID: number, username: string, sessionID: string, jwt: JWTSign) {
    return await jwt.sign({
        id: `${userID}`,
        username: username
    });
}

function setAuth(sessionID: string, token: string, setCookie: SetCookie) {
    setCookie(Cookies.sessionID, sessionID, {
        httpOnly: true,
    });

    setCookie(Cookies.sessionToken, token, {
        httpOnly: true,
    });
}

function clearAuth(removeCookie: RemoveCookie) {
    removeCookie(Cookies.sessionID);
    removeCookie(Cookies.sessionToken);
}

export function createUserHandler(userAccess: UserAccess) {
    const AuthRouter = new Elysia()
        .use(setupLogger)
        .use(setupRoutes)
        .state(State.userAccess, userAccess)
        .post(Routes.auth.keys.logout, async ({cookie, store: {userAccess}, removeCookie}) => {
            await userAccess.logoutUser(cookie[Cookies.sessionID]);
            clearAuth(removeCookie);
            return {
                success: true
            }
        }, {
            body: t.Undefined()
        })
        .post(Routes.auth.keys.register, async ({store: {userAccess}, setCookie, params, jwt, set, body}) => {
            const result = await userAccess.registerUser(body);

            if (!result) {
                return new ValidationError("Failed to register user");
            }

            const {sessionID} = result;
            const token = await signToken(result.user.id, result.user.username, sessionID, jwt)
            await userAccess.saveUserSession(result.user.id, result.sessionID, token);

            setAuth(sessionID, token, setCookie);

            return {
                user: User.sanatize(result.user)
            }
        }, {
            body: RegisterRequest
        })
        .post(Routes.auth.keys.login, async ({store: {userAccess}, jwt, params, setCookie, body, set}) => {
            const result = await userAccess.loginUser(body.username, body.password);

            if (!result) {
                return new ValidationError("Invalid username or password");
            }

            const {sessionID} = result;
            const token = await signToken(result.user.id, result.user.username, sessionID, jwt)
            await userAccess.saveUserSession(result.user.id, result.sessionID, token);
            setAuth(sessionID, token, setCookie);

            return {
                user: User.sanatize(result.user),
            }
        }, {
            body: LoginRequest
        });

    const ProfileRouter = new Elysia()
        .use(setupLogger)
        .use(setupRoutes)
        .state<{
            user: User | null;
        }>({
            user: null,
        })
        .derive(({cookie, set, store, logger, jwt, removeCookie}) => ({
            validateAuth: async () => {
                const sessionID = cookie[Cookies.sessionID];
                const token = cookie[Cookies.sessionToken];

                if (!sessionID || !token) {
                    logger.error("Missing session id or token");
                    set.status = 401;
                    throw new ValidationError("Invalid user");
                }

                let profile: JWTProfile;

                try {
                    profile = await jwt.verify(token) as JWTProfile;
                } catch (e) {
                    let errMessage = "Failed to verify token"
                    if (e instanceof Error) {
                        errMessage += `: ${e.message}`;
                    }
                    logger.error(`Failed to verify token: ${errMessage}`);
                    set.status = 401;
                    throw new ValidationError("Invalid user");
                }

                let user = null;

                try {
                    user = await userAccess.validateSession(sessionID, profile);

                    if (!user) {
                        clearAuth(removeCookie);
                        set.status = 401;
                        return false;
                    }

                    store.user = user;
                } catch (e) {
                    let errMessage = "Failed to verify session"
                    if (e instanceof Error) {
                        errMessage += `: ${e.message}`;
                    }
                    logger.error(`Failed to verify token: ${errMessage}`);
                    set.status = 401;
                    throw new ValidationError("Invalid user");
                }
            }
        }))
        .guard({},
            app => app
                .onBeforeHandle(({validateAuth, logger}) => {
                    logger.info('validating auth');
                    return validateAuth();
                })
                .get(Routes.profile.keys.me, async ({cookie}) => {
                    const sessionID = cookie[Cookies.sessionID];
                    const user = await userAccess.getUserBySession(sessionID);
                    return {
                        user: User.sanatize(user),
                    }
                })
                .post(Routes.profile.keys.me, async ({body, store, cookie}) => {
                    if (!store.user) {
                        return new ValidationError("User not found");
                    }

                    await userAccess.updateUser(store.user.id, {
                        display_name: body.display_name,
                    });

                    return {
                        success: true
                    }
                }, {
                    body: ProfileUpdateRequest
                })
                .put(Routes.profile.keys.archive, async ({body, removeCookie, cookie}) => {
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
        .model({
            login: LoginResponse,
            errorResponse: ErrorResponseMessage,
        })
        .use(setupRoutes)
        .group(Routes.auth.base, (app) => {
            return app
                .use(AuthRouter)
        })
        .group(Routes.profile.base, (app) => {
            return app
                .use(ProfileRouter)
        })
}


