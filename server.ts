///<reference path='./typings/main.d.ts' />

import * as express from "express";
import * as path from "path";
import {logger,stream as loggerStream} from "./logger";
import * as Promise from "bluebird";
import * as morgan from "morgan";

const moment = require("moment");

moment.locale("es");

export const app = express();

/**
* logger
*/
logger.debug("Overriding 'Express' logger");
app.use(morgan("combined",{ "stream": loggerStream }));

/**
 * Declaración de rutas
 */
app.use('/static', express.static(path.join(__dirname,'public')));
//app.use("/rest",routes);
//app.use("/sprint",sprintRoutes);

app.use("/test",(req, res, next) => {
    res.send("Hello World");
});


app.listen(3000, () => {
    logger.info("Sauron 2.0 server arrancado en modo: ", !process.env.NODE_ENV?'development':process.env.NODE_ENV);
});

