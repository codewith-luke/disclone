import {Elysia} from "elysia";
import {cors} from '@elysiajs/cors';

import {userHandler} from "./user-handler";
import {setup} from "./setup";
import {createHttpErrorResponse, ErrorCodes, HttpErrorMessages} from "./error";
import {RequestLifeCycle} from "./logger";
import {Routes} from "./types";

export function createApp() {
    return new Elysia()
        .use(setup)
        .use(cors())
        .onResponse(({logger}) => {
            logger.info(RequestLifeCycle.end)
        })
        .get(Routes.heartbeat, () => "ok")
        .use(userHandler)
        .onError(({code, error}) => {
            switch (code) {
                case ErrorCodes.VALIDATION:
                    return createHttpErrorResponse(HttpErrorMessages.invalidCredentials, error);
                default:
                    return createHttpErrorResponse(HttpErrorMessages.unknownError, error);
            }
        })
}

const app = createApp()
    .listen(Bun.env.PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
