"use strict";
const winston_1 = require("winston");
const config_1 = require("./config");
const mysql_1 = require("mysql");
const assert = require("assert");
class AppLogger {
    constructor(config) {
        var atransports = [];
        if (config.log && config.log.console) {
            atransports.push(new (winston_1.transports.Console)(config.log.console));
        }
        if (config.log && config.log.file) {
            atransports.push(new (winston_1.transports.File)(config.log.file));
        }
        this._logger = new winston_1.Logger({
            transports: atransports,
            exitOnError: false
        });
    }
    get logger() {
        return this._logger;
    }
}
const appLogger = new AppLogger(config_1.config);
exports.logger = appLogger.logger;
exports.loggerStream = {
    write: (message) => {
        exports.logger.info(message);
    }
};
class Database {
    connect(profile) {
        this.profile = profile;
        exports.logger.info(`Creando el pool de base de datos: ${this.profile.host}/${this.profile.database}`);
        try {
            this.connectionPool = mysql_1.createPool(this.profile);
        }
        catch (e) {
            exports.logger.error(`Error al conectar con la base de datos: ${this.profile.host}/${this.profile.database}`, e);
            process.exit(1);
        }
    }
    query(strSql, params) {
        exports.logger.info(strSql + "; Params: [" + params + "]");
        return new Promise((resolve, reject) => {
            this.connectionPool.query(strSql, params, (err, result) => {
                if (err)
                    return reject(err);
                return resolve(JSON.parse(JSON.stringify(result)));
            });
        });
    }
    queryForOne(strSql, params) {
        return this.query(strSql, params).then(result => result[0]);
    }
    shutdown() {
        exports.logger.info(`Parando el pool de base de datos: ${this.profile.host}/${this.profile.database}`);
        this.connectionPool.end();
    }
}
exports.database = new Database();
exports.checkNotNull = function (paramName, param) {
    assert.notEqual(param, null, `El parámetro de entrada '${paramName}' está vacío`);
};
exports.checkNotFound = function (resultName, result, resultId) {
    assert.notEqual(result, null, `No se ha encontrado '${resultName}' para el identificador: ${resultId}`);
};
