import {Elysia} from "elysia";
import {ErrorCodes, InternalError, UnknownError, ValidationError} from "./util/error";
import {loggers, RequestLifeCycle} from "./util/logger";
import {cookie} from "@elysiajs/cookie";
import {UserCache} from "./core/user-cache";

const traceIDHeader = "x-trace-id";

export const setupLogger = new Elysia({name: "setupLogger"})
    .derive((ctx) => {
        const traceID = ctx.headers[traceIDHeader];

        if (!traceID) {
            loggers.basicLogger.warn(`No traceID found in headers`);
        }

        loggers.requestLogger.defaultMeta.traceID = traceID || loggers.requestLogger.defaultMeta.traceID;
        loggers.requestLogger.defaultMeta.req = {
            body: ctx.body,
            params: ctx.params,
            query: ctx.query
        };
        loggers.requestLogger.defaultMeta.path = ctx.path;
        loggers.basicLogger.defaultMeta.traceID = traceID || loggers.requestLogger.defaultMeta.traceID;
        loggers.requestLogger.info(RequestLifeCycle.start);

        return {
            logger: loggers.requestLogger
        };
    });

export const setupRoutes = new Elysia({name: "setupRoutes"})
    .use(cookie())
    .state('userCache', new UserCache())
    .addError({
        [ErrorCodes.VALIDATION]: ValidationError,
        [ErrorCodes.UNKNOWN]: UnknownError,
        [ErrorCodes.INTERNAL_SERVER_ERROR]: InternalError,
        [ErrorCodes.QUERY_ERROR]: InternalError,
    });


