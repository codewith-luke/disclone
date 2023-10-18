import createDBConn from "./db";
import {Elysia, ValidationError} from "elysia";
import {cors} from "@elysiajs/cors";
import {loggers, RequestLifeCycle} from "./util/logger";
import {Routes} from "./types";
import {createUserHandler} from "./user-handler";
import {BaseError, ErrorCodes} from "./util/error";
import {createAuthDB} from "./access/db-access";
import {createUserAccess} from "./use-cases/user-access";
import {setupLogger, setupRoutes} from "./setup";

function setupHandlers() {
    const dbConn = createDBConn();
    const authDB = createAuthDB(loggers.basicLogger, dbConn);
    const userAccess = createUserAccess(authDB, loggers.basicLogger)
    const userHandler = createUserHandler(userAccess);

    return {
        dbConn,
        userHandler
    }
}

export function createApp() {
    const {dbConn, userHandler} = setupHandlers();

    return new Elysia()
        .use(setupRoutes)
        .use(setupLogger)
        .onResponse(({logger}) => {
            // logger.info(RequestLifeCycle.end)
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
                case ErrorCodes.NOT_FOUND:
                    err.status = 404;
                    break;
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

