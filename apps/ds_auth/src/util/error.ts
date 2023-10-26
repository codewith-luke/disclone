import {ErrorResponseMessage} from "../types";

export const ErrorCodes = {
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    QUERY_ERROR: "QUERY_ERROR",
    VALIDATION: "VALIDATION",
    BAD_REQUEST: "BAD_REQUEST",
    PARSE: "PARSE",
    UNKNOWN: "UNKNOWN"
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

export interface IError extends Error {
    status: number;
    code: ErrorCode;
    createHttpResponse: () => ErrorResponseMessage;
}

export class BaseError extends Error implements IError {
    constructor(private statusCode: ErrorCode, message?: string) {
        super(message);
        this.name = statusCode.toUpperCase();
        this.message = message ? message : "Unknown Error";
    }

    get code() {
        return this.statusCode;
    }

    get status() {
        return HttpErrorMessages[this.statusCode].status;
    }

    createHttpResponse(message?: string) {
        const httpMessage = HttpErrorMessages[this.code];
        httpMessage.message = message || this.message;
        return httpMessage;
    }
}

export class ValidationError extends BaseError {
    constructor(message?: string, code?: ErrorCode) {
        super(code || ErrorCodes.VALIDATION, message || "Validation Error");
    }
}

export class BadRequestError extends BaseError {
    constructor(message?: string) {
        super(ErrorCodes.BAD_REQUEST, message || "Bad Request Error");
    }
}

export class InternalError extends BaseError {
    constructor(message?: string) {
        super(ErrorCodes.INTERNAL_SERVER_ERROR, message || "Internal Error");
    }
}

export class QueryError extends BaseError {
    constructor(message?: string) {
        super(ErrorCodes.QUERY_ERROR, message || "Query Error");
    }
}

export class UnknownError extends BaseError {
    constructor(message?: string) {
        super(ErrorCodes.UNKNOWN, message || "Unknown Error");
    }
}

export const HttpErrorMessages: Record<keyof typeof ErrorCodes, ErrorResponseMessage> = {
    NOT_FOUND: {
        status: 404,
        message: "Not Found",
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        message: "Internal Server Error",
    },
    QUERY_ERROR: {
        status: 501,
        message: "Query Error",
    },
    VALIDATION: {
        status: 401,
        message: "Validation Error",
    },
    BAD_REQUEST: {
        status: 400,
        message: "Bad Request Error",
    },
    PARSE: {
        status: 400,
        message: "Parse Error",
    },
    UNKNOWN: {
        status: 500,
        message: "Unknown Error",
    }
}