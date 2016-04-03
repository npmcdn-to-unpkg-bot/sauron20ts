"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs_1 = require("fs");
const Promise = require("bluebird");
const util_database_1 = require("./util-database");
var readdirAsync = Promise.promisify(fs_1.readdir);
var para = Promise.promisify(setTimeout);
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let CASA_DB = {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'sauron'
        };
        util_database_1.database.connect(CASA_DB);
        var r = yield util_database_1.database.queryForOne("Select * from sprint where id = ?", [88]);
        console.log(r);
        util_database_1.database.shutdown();
    });
}
main();
