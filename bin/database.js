"use strict";
const logger_1 = require("./logger");
const mysql_1 = require("mysql");
class Database {
    connect(profile) {
        this.profile = profile;
        logger_1.logger.info(`Creando el pool de base de datos: ${this.profile.host}/${this.profile.database}`);
        try {
            this.connectionPool = mysql_1.createPool(this.profile);
        }
        catch (e) {
            logger_1.logger.error(`Error al conectar con la base de datos: ${this.profile.host}/${this.profile.database}`, e);
            process.exit(1);
        }
    }
    query(strSql, params) {
        logger_1.logger.info(strSql + "; Params: [" + params + "]");
        return new Promise((resolve, reject) => {
            this.connectionPool.query(strSql, params, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(result);
            });
        });
    }
    queryForOne(strSql, params) {
        return this.query(strSql, params).then(result => result[0]);
    }
    shutdown() {
        logger_1.logger.info(`Parando el pool de base de datos: ${this.profile.host}/${this.profile.database}`);
        this.connectionPool.end();
    }
}
exports.database = new Database();
