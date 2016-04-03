"use strict";
const express = require("express");
const path = require("path");
const logger_1 = require("./logger");
const morgan = require("morgan");
const templates = require("nunjucks");
const database_1 = require("./database");
const router_sprint_1 = require("./router-sprint");
const moment = require("moment");
moment.locale("es");
exports.app = express();
logger_1.logger.debug("Overriding 'Express' logger");
exports.app.use(morgan("combined", { "stream": logger_1.stream }));
if (process.env.NODE_ENV == "production") {
    database_1.database.connect({
        host: '10.0.100.118',
        user: 'ahg',
        password: 'jira12345',
        database: 'sauron'
    });
}
else {
    database_1.database.connect({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sauron'
    });
}
exports.app.set('views', path.join(__dirname, 'views'));
exports.app.set('view engine', 'twig');
exports.app.locals.basedir = exports.app.get('views');
exports.app.locals.moment = moment;
templates.configure('views', {
    autoescape: false,
    express: exports.app,
    watch: true
});
exports.app.use('/static', express.static(path.join(__dirname, '../public')));
logger_1.logger.debug(path.join(__dirname, 'public'));
exports.app.use("/sprint", router_sprint_1.router);
exports.app.use("/test", (req, res, next) => {
    res.render("test");
});
exports.app.listen(process.env.NODE_PORT || 3000, () => {
    logger_1.logger.info(`Sauron 2.0 server arrancado en el puerto ${exports.app.get('port')} en modo: ${!process.env.NODE_ENV ? 'development' : process.env.NODE_ENV}`);
});
