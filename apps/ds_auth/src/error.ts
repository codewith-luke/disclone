import {ErrorResponseMessage} from "./types";

export const ErrorCodes = {
    NOT_FOUND: "NOT_FOUND",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    QUERY_ERROR: "QUERY_ERROR",
    VALIDATION: "VALIDATION",
    PARSE: "PARSE",
    UNKNOWN: "UNKNOWN"
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

export interface IError extends Error {
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

    createHttpResponse(message?: string) {
        const httpMessage = HttpErrorMessages[this.code];
        httpMessage.body.message = message || this.message;
        return httpMessage;
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
        body: {
            message: "Not Found",
        }
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        body: {
            message: "Internal Server Error",
        }
    },
    QUERY_ERROR: {
        status: 501,
        body: {
            message: "Query Error",
        }
    },
    VALIDATION: {
        status: 401,
        body: {
            message: "Validation Error",
        }
    },
    PARSE: {
        status: 400,
        body: {
            message: "Parse Error",
        }
    },
    UNKNOWN: {
        status: 500,
        body: {
            message: "Unknown Error",
        }
    }
}