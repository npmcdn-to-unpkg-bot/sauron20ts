///<reference path='./typings/main.d.ts' />
"use strict";

import {Logger,transports} from "winston";
import {config} from "./config";
import {createPool, IPool} from "mysql";
import {IQuery} from "mysql";
const Immutable = require("seamless-immutable");

class AppLogger {

    _logger: any;

    constructor(config:any) {

        var atransports = [];
        if(config.log.console) {
            atransports.push(new (transports.Console)(config.log.console));
        }

        if(config.log.file) {
            atransports.push(new (transports.File)(config.log.file));
        }
        console.log(transports);

        this._logger = new Logger({
            transports: atransports,
            exitOnError: false
        });
    }

    get logger() {
        return this._logger;
    }
}

const appLogger = new AppLogger(config);

/**
 * Instancia de logger
 * @type {LoggerInstance}
 */
export const logger = appLogger.logger;

/**
 * Stream de logger para sobreescribir el logger de
 * @type {{write: (function(string): void)}}
 */
export const loggerStream = {
    write:(message: string): void => {
        logger.info(message)
    }
};


export interface DatabaseProfile {
    host: string,
    user: string,
    password: string,
    database: string
}

class Database {

    connectionPool:IPool;
    profile: DatabaseProfile;

    connect(profile:DatabaseProfile) {

        this.profile = profile;

        logger.info(`Creando el pool de base de datos: ${this.profile.host}/${this.profile.database}`);
        try {
            this.connectionPool = createPool(this.profile);
        }
        catch(e) {
            logger.error(`Error al conectar con la base de datos: ${this.profile.host}/${this.profile.database}`
                ,e);
            process.exit(1);
        }
    }

    query(strSql:string,params?:Array<any>): Promise<Array<any>> {
        logger.info(strSql + "; Params: [" + params + "]");
        return new Promise<Array<any>>((resolve,reject) => {
            this.connectionPool.query(strSql,params,(err,result)=> {
                if(err) return reject(err);
                return resolve(Immutable(result));
            })
        });
    }

    queryForOne(strSql:string,params?:Array<any>): Promise<any> {
        return this.query(strSql,params).then(result => Immutable(result[0]));
    }


    shutdown() {
        logger.info(`Parando el pool de base de datos: ${this.profile.host}/${this.profile.database}`);
        this.connectionPool.end();

    }

}

export const database = new Database();