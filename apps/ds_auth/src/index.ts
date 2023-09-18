import {Elysia} from "elysia";
import {cors} from '@elysiajs/cors';

import {userHandler} from "./user-handler";
import {setup} from "./setup";
import {createHttpErrorResponse, ErrorCodes, HttpErrorMessages, IError} from "./error";
import {RequestLifeCycle} from "./logger";
import {Routes} from "./types";

export function createApp() {
    return new Elysia()
        .use(setup)
        .use(cors())
        .onResponse(({logger}) => {
            logger.info(RequestLifeCycle.end)
        })
        .onError(({code, error}) => {
            switch (code) {
                case ErrorCodes.VALIDATION:
                    return createHttpErrorResponse(HttpErrorMessages.invalidCredentials, error as IError)
                default:
                    return createHttpErrorResponse(HttpErrorMessages.unknownError, error as IError)
            }
        })
        .get(Routes.heartbeat, () => "ok")
        .use(userHandler)
}

const app = createApp()
    .listen(Bun.env.PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
