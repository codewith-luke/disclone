import createDBConn from "./db";
import {Elysia, ValidationError} from "elysia";
import { cors } from '@elysiajs/cors'
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
        .use(cors({
            origin: false,
        }))
        .use(setupRoutes)
        .use(setupLogger)
        .onAfterHandle((context) => {
            let error = null;
            let result = null;

            if (context.response instanceof BaseError) {
                error = context.response.createHttpResponse();
                context.set.status = error.status;
            } else if (context.response instanceof Error) {
                error = context.response.message;
                context.set.status = 500;
            } else {
                result = context.response;
            }

            context.response = {
                error,
                result
            }
        })
        .onResponse(({logger}) => {
            logger.info(RequestLifeCycle.end);
        })
        .get(Routes.heartbeat, () => "ok")
        .use(userHandler)
        .onError(({code, error, set}) => {
            const err = {
                status: 500,
                message: error.message ?? "Unknown Error",
            }

            switch (code) {
                case ErrorCodes.VALIDATION:
                    const {status} = error as ValidationError;
                    err.status = status;
                    break;
            }

            if (error instanceof BaseError) {
                err.status = error.status;
                set.status = error.status;
            } else if (code === ErrorCodes.NOT_FOUND) {
                err.status = 404;
                set.status = err.status;
            }

            return {
                error: err,
                result: null
            };
        })
        .onStop(async () => {
            if (dbConn) {
                await dbConn.end();
            }
        })
}

