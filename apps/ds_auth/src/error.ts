import {ErrorResponseMessage} from "./types";

export const ErrorCodes = {
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    VALIDATION: "VALIDATION",
    PARSE: "PARSE",
    UNKNOWN: "UNKNOWN",
    CUSTOM_ERROR: "CUSTOM_ERROR",
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

export interface IError extends Error {
    code: ErrorCode;
}

class BaseError extends Error implements IError {
    constructor(private statusCode: ErrorCode, message?: string) {
        super(message);
        this.name = statusCode.toUpperCase();
        this.message = message ? message : "Unknown Error";
    }

    get code() {
        return this.statusCode;
    }
}

export class ValidationError extends BaseError {
    constructor(message?: string) {
        super(ErrorCodes.VALIDATION, message || "Validation Error");
    }
}

export class InternalError extends BaseError {
    constructor(message?: string) {
        super(ErrorCodes.INTERNAL_SERVER_ERROR, message || "Internal Error");
    }
}

export class UnknownError extends BaseError {
    constructor(message?: string) {
        super(ErrorCodes.UNKNOWN, message || "Unknown Error");
    }
}

export class CustomError extends BaseError {
    constructor(message?: string) {
        super(ErrorCodes.CUSTOM_ERROR, message || "Custom Error");
    }
}

export const HttpErrorMessages: Record<string, ErrorResponseMessage> = {
    unknownError: {
        status: 500,
        message: "Unknown Error",
    },
    invalidCredentials: {
        status: 401,
        message: "Invalid Credentials",
    }
}

export function createHttpErrorResponse(error: ErrorResponseMessage, e?: Error | IError) {
    const err = {
        status: error.status,
        body: {
            message: error.message,
            error: e?.message || "Unknown Error",
            code: ErrorCodes.UNKNOWN as string,
        }
    }

    if (e instanceof BaseError) {
        err.body.code = e.code;
    }

    return err;
}