import {Elysia} from "elysia";
import {CustomError, ErrorCodes, InternalError, UnknownError, ValidationError} from "./error";
import {logger} from "./logger";

let id = 0;

export const setup = new Elysia({name: 'setup'})
    .derive((ctx) => {
        console.log(ctx)
        logger.defaultMeta = {trace_id: id++};
        return {
            logger: logger
        };
    })
    .addError({
        [ErrorCodes.VALIDATION]: ValidationError,
        [ErrorCodes.UNKNOWN]: UnknownError,
        [ErrorCodes.INTERNAL_SERVER_ERROR]: InternalError,
        [ErrorCodes.CUSTOM_ERROR]: CustomError
    });


