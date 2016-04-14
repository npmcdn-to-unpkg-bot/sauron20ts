///<reference path='./typings/main.d.ts' />
"use strict";

import * as express from "express";
import * as path from "path";
import {logger,loggerStream,database} from "./util";
import {config} from "./config";
import * as Promise from "bluebird";
import * as morgan from "morgan";
import * as templates from "nunjucks";
import {router as sprintRouter} from "./router-sprint";
import {router as sprintRestRouter} from "./router-rest-sprint";
const moment = require("moment");

moment.locale("es");

export const app = express();

/**********************************************************************************************************************
 * Logger
 **********************************************************************************************************************/
logger.debug("Overriding 'Express' logger");
app.use(morgan("combined",{ "stream": loggerStream }));


/**********************************************************************************************************************
 * Se conecta a la base de datos
 **********************************************************************************************************************/
if(process.env.NODE_ENV == "production") {
    database.connect(config.database.prod);
}
else {
    database.connect(config.database.dev);
}


/**********************************************************************************************************************
 * Configura el motor de vista
 **********************************************************************************************************************/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.locals.basedir = app.get('views');

//--- Habilita moment para que esté disponible por defecto en las plantillas
app.locals.moment = moment;

templates.configure('views', {
    autoescape: false,
    express: app,
    watch: true
});


/**********************************************************************************************************************
 * Configuración de rutas
 **********************************************************************************************************************/
app.use('/node_modules', express.static(path.join(__dirname,'../node_modules')));

app.use(express.static('public'));

app.use("/sprint",sprintRouter);

app.use("/rest/sprint",sprintRestRouter);


/**********************************************************************************************************************
 * Servidor
 **********************************************************************************************************************/
app.listen(process.env.NODE_PORT || 3000, () => {
    logger.info(`Sauron 2.0 server arrancado en el puerto ${process.env.NODE_PORT || 3000} en modo: ${!process.env.NODE_ENV?'DEVELOPMENT':process.env.NODE_ENV.toUpperCase()}`);
});

