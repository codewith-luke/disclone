import {Elysia} from "elysia";
import {ErrorCodes, InternalError, UnknownError, ValidationError} from "./error";
import {loggers, RequestLifeCycle} from "./logger";
import {cookie} from "@elysiajs/cookie";

const traceIDHeader = "x-trace-id";

export const setup = new Elysia({name: "setup"})
    .use(cookie({
        httpOnly: true,
    }))
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
    })
    .addError({
        [ErrorCodes.VALIDATION]: ValidationError,
        [ErrorCodes.UNKNOWN]: UnknownError,
        [ErrorCodes.INTERNAL_SERVER_ERROR]: InternalError,
        [ErrorCodes.QUERY_ERROR]: InternalError,
    });


