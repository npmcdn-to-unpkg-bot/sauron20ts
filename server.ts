///<reference path='./typings/main.d.ts' />

import * as express from "express";
import * as path from "path";
import {logger,stream as loggerStream} from "./logger";
import * as Promise from "bluebird";
import * as morgan from "morgan";
import * as templates from "nunjucks";
import {database} from "./database";
import {router as sprintRouter} from "./router-sprint";
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
    database.connect({
        host: '10.0.100.118',
        user: 'ahg',
        password: 'jira12345',
        database: 'sauron'
    });
}
else {
    database.connect({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sauron'
    });
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
app.use('/static', express.static(path.join(__dirname,'../public')));

logger.debug(path.join(__dirname,'public'));

app.use("/sprint",sprintRouter);

app.use("/test",(req, res, next) => {
    res.render("test");
});

/**********************************************************************************************************************
 * Servidor
 **********************************************************************************************************************/
app.listen(process.env.NODE_PORT || 3000, () => {
    logger.info(`Sauron 2.0 server arrancado en el puerto ${app.get('port')} en modo: ${!process.env.NODE_ENV?'development':process.env.NODE_ENV}`);
});

