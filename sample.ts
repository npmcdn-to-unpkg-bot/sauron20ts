///<reference path='./typings/main.d.ts' />

//var config = require("./config");
import {logger, database} from "./util";
import {config} from "./config";
import * as Immutable from "immutable";

logger.info("Vamos cabrón");
database.connect(config.toJS().database.prod);

function q() {
    console.log("Mierda");
    database.queryForOne("Select * from sprint where id = ?", Immutable.List([36])).then(sprint => {
        console.log(sprint);
    });

}

q();