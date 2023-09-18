import winston, {format} from "winston";
import {Environments, Routes} from "./types";
const {combine, timestamp, printf} = format;

const filterList = [Routes.login];

export const RequestLifeCycle = {
    start: "start",
    end: "end",
} as const;

const LoggerTypes = {
    RequestLogger: 'RequestLogger',
    BasicLogger: 'BasicLogger'
} as const;

const requestFormat = printf((logData) => {
    const {level, path, message, traceID, req, timestamp} = logData;
    const {params, query, body} = req;
    let data: string | {
        params: any;
        query: any;
        body: any;
    } = 'private';

    if (filterList.includes(path) && Bun.env.NODE_ENV === Environments.development) {
        data = {
            params,
            query,
            body
        }
    }

    return `[${level}] ${timestamp} [${traceID}]: ${path} ${JSON.stringify(data)}, ${message}`;
});

const basicFormat = printf((data) => {
    const {level, message, traceID, timestamp} = data;
    return `[${level}] ${timestamp} [${traceID}]: message - ${message}`;
});

winston.loggers.add(LoggerTypes.BasicLogger, {
    format: combine(
        timestamp(),
        basicFormat
    ),
    defaultMeta: {
        traceID: 'no-trace-id'
    },
    transports: [
        new winston.transports.Console({level: 'silly',}),
    ]
});

winston.loggers.add(LoggerTypes.RequestLogger, {
    format: combine(
        timestamp(),
        requestFormat,
    ),
    defaultMeta: {
        traceID: 'no-trace-id'
    },
    transports: [
        new winston.transports.Console({level: 'silly',}),
    ]
});

export const loggers = {
    basicLogger: winston.loggers.get(LoggerTypes.BasicLogger),
    requestLogger: winston.loggers.get(LoggerTypes.RequestLogger)
}