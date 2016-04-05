///<reference path='./typings/main.d.ts' />
import {Logger,transports} from "winston";
import {config} from "./config";
import {createPool, IPool,IQuery} from "mysql";
import * as Immutable from "immutable";

class AppLogger {

    _logger: any;

    constructor(config:any) {

        var atransports = [];
        if(config.get("log") && config.get("log").get("console")) {
            atransports.push(new (transports.Console)(config.get("log").get("console").toJS()));
        }

        if(config.get("log") && config.get("log").get("file")) {
            atransports.push(new (transports.File)(config.get("log").get("file").toJS()));
        }
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

    query(strSql:string,iparams?:Immutable.List<any>): Promise<Immutable.List<any>> {
        var params = iparams.toJS();
        //logger.info(strSql + "; Params: [" + params + "]");
        return new Promise<Immutable.List<any>>((resolve,reject) => {
            this.connectionPool.query(strSql,params,(err,result)=> {
                if(err) return reject(err);
                return resolve(Immutable.fromJS(Immutable.fromJS(JSON.parse(JSON.stringify(result)))));
            })
        });
    }

    queryForOne(strSql:string,params?:Immutable.List<any>): Promise<Immutable.Map<any,any>> {
        return this.query(strSql,params).then(result => result.get(0));
    }


    shutdown() {
        logger.info(`Parando el pool de base de datos: ${this.profile.host}/${this.profile.database}`);
        this.connectionPool.end();

    }

}

export const database = new Database();