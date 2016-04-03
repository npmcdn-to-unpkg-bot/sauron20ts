///<reference path='./typings/main.d.ts' />

import ErrnoException = NodeJS.ErrnoException;
import {readdir} from "fs";
const Promise = require("bluebird");
import {logger} from "./logger";
import {DatabaseProfile} from "./database";
import {Database} from "./database";
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

    var db:Database = new Database();

    db.connect(CASA_DB);

    var r = await db.queryForOne("Select * from sprint where id = ?", [88]);

    console.log(r);

    db.shutdown();
}

main();