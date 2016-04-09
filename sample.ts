///<reference path='./typings/main.d.ts' />

import {logger, database} from "./util";
import {config} from "./config";

database.connect(config.database.dev);

async function q() {

    try {
        var sprint = await database.queryForOne("Select * from sprint where id = ?", [36]);
    }
    catch(e) {
        console.log("PAHA");
        logger.error(e);
    }

}

q();