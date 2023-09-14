import winston from "winston";

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
        service: 'ds_auth'
    },
    transports: [
        new winston.transports.Console({
            format: winston.format.cli(),
        }),
    ]
});