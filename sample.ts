///<reference path='./typings/main.d.ts' />

import ErrnoException = NodeJS.ErrnoException;
import {readdir} from "fs";
const Promise = require("bluebird");
import {logger} from "./util-logger";
import {DatabaseProfile} from "./util-database";
import {database} from "./util-database";
import {IQuery} from "mysql";

var readdirAsync = Promise.promisify(readdir);

var para = Promise.promisify(setTimeout);

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

    let CASA_DB:DatabaseProfile = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sauron'
    };

    database.connect(CASA_DB);

    var r = await database.queryForOne("Select * from sprint where id = ?", [88]);

    console.log(r);

    database.shutdown();
}

main();