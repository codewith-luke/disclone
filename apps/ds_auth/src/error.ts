export const errorCodes = {
    unknown: "unknown",
    validationError: "validationError",
} as const;

interface IError {
    code: string;
}

class BaseError extends Error implements IError {
    constructor(private statusCode: string, name: string, message?: string) {
        super(message);
        this.name = name;
        this.message = message ? message : "Unknown Error";
    }

    get code() {
        return this.statusCode;
    }
}

export class ValidationError extends BaseError {
    constructor(message?: string) {
        super(errorCodes.validationError, "ValidationError", message ? message : "Validation Error");
    }
}

export class UnknownError extends BaseError {
    constructor(message?: string) {
        super(errorCodes.unknown, "UnknownError", "Unknown Error");
    }
}