///<reference path='./typings/main.d.ts' />

import {Logger,transports} from "winston";

export const logger = new Logger({
    transports: [
        /*
         new winston.transports.File({
         level: 'info',
         filename: './logs/all-logs.log',
         handleExceptions: true,
         json: true,
         maxsize: 5242880, //5MB
         maxFiles: 5,
         colorize: false
         }), */
        new transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

export const stream = {
    write:(message: string) => {
        logger.info(message)
    }
};