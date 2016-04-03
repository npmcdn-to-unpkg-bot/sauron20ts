///<reference path='./typings/main.d.ts' />

import {logger} from "./logger";

import {createPool, IPool} from "mysql";
import {IQuery} from "mysql";

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
                return resolve(result);
            })
        });
    }

    queryForOne(strSql:string,params?:Array<any>): Promise<any> {
        return this.query(strSql,params).then(result => result[0]);
    }


    shutdown() {
        logger.info(`Parando el pool de base de datos: ${this.profile.host}/${this.profile.database}`);
        this.connectionPool.end();

    }

}

export const database = new Database();
