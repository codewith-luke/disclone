import {Elysia} from "elysia";
import {BadRequestError, ErrorCodes, InternalError, UnknownError, ValidationError} from "./util/error";
import {loggers, RequestLifeCycle} from "./util/logger";
import {cookie} from "@elysiajs/cookie";
import {UserCache} from "./core/user-cache";
import jwt from "@elysiajs/jwt";

const traceIDHeader = "x-trace-id";

export const setupLogger = new Elysia({name: "setupLogger"})
    .derive((ctx) => {
        const traceID = ctx?.headers ? ctx?.headers[traceIDHeader] : null;

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
    .use(
        jwt({
            name: 'jwt',
            // TODO: Needs to be stored somewhere safe. idk like a env
            secret: 'Fischl von Luftschloss Narfidort',
            exp: '14d',
        })
    )
    .use(cookie({
        httpOnly: true,
    }))
    .state('userCache', new UserCache())
    .error({
        [ErrorCodes.VALIDATION]: ValidationError,
        [ErrorCodes.BAD_REQUEST]: BadRequestError,
        [ErrorCodes.UNKNOWN]: UnknownError,
        [ErrorCodes.INTERNAL_SERVER_ERROR]: InternalError,
        [ErrorCodes.QUERY_ERROR]: InternalError,
    });


