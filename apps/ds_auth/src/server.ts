import createDBConn, {DB} from "./db";
import {Elysia, ValidationError} from "elysia";
import {setup} from "./setup";
import {cors} from "@elysiajs/cors";
import {RequestLifeCycle} from "./logger";
import {Routes} from "./types";
import {userHandler} from "./user-handler";
import {BaseError, ErrorCodes} from "./error";

export let dbConn: DB | null = null;

export function createApp() {
    dbConn = createDBConn();

    return new Elysia()
        .use(setup)
        .use(cors())
        .onResponse(({logger}) => {
            logger.info(RequestLifeCycle.end)
        })
        .get(Routes.heartbeat, () => "ok")
        .use(userHandler)
        .onError(({code, error}) => {
            if (error instanceof BaseError) {
                return error.createHttpResponse();
            }

            const err = {
                status: 500,
                body: {
                    message: error.message ?? "Unknown Error",
                }
            }

            switch (code) {
                case ErrorCodes.VALIDATION:
                    const {status} = error as ValidationError;
                    err.status = status;
                    break;
            }

            return err;
        })
        .onStop(async () => {
            if (dbConn) {
                await dbConn.end();
            }
        })
}

