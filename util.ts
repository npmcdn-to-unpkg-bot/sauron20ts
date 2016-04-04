///<reference path='./typings/main.d.ts' />

import {Logger,transports} from "winston";


class Logger {
    constructor(config:Map) {
        var transports = [];
        if(config.get('log').console)
    }
}

/**
 * Instancia de logger
 * @type {LoggerInstance}
 */
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
/**
 * Stream de logger para sobreescribir el logger de
 * @type {{write: (function(string): void)}}
 */
export const loggerStream = {
    write:(message: string): void => {
        logger.info(message)
    }
};

/**
 * Devuelve una copia inmutable de un objeto
 * @param obj
 * @returns {any}
 * @constructor
 */
export const Immutable = (obj: any): any => {

    //--- Obtiene las propiedades del objeto
    var propNames = Object.getOwnPropertyNames(obj);

    // --- Recorre recursivamente las propiedades y las hace inmutables
    propNames.forEach(function(name) {
        var prop = obj[name];

        if (typeof prop == 'object' && prop !== null)
            Immutable(prop);
    });

    //--- Finalmente se hace así mismo immutable
    return Object.freeze(obj);

}
