"use strict";
const express = require("express");
const path = require("path");
const util_logger_1 = require("./util-logger");
const morgan = require("morgan");
const templates = require("nunjucks");
const util_database_1 = require("./util-database");
const router_sprint_1 = require("./router-sprint");
const moment = require("moment");
moment.locale("es");
exports.app = express();
util_logger_1.logger.debug("Overriding 'Express' logger");
exports.app.use(morgan("combined", { "stream": util_logger_1.stream }));
if (process.env.NODE_ENV == "production") {
    util_database_1.database.connect({
        host: '10.0.100.118',
        user: 'ahg',
        password: 'jira12345',
        database: 'sauron'
    });
}
else {
    util_database_1.database.connect({
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
util_logger_1.logger.debug(path.join(__dirname, 'public'));
exports.app.use("/sprint", router_sprint_1.router);
exports.app.use("/test", (req, res, next) => {
    res.render("test");
});
exports.app.listen(process.env.NODE_PORT || 3000, () => {
    util_logger_1.logger.info(`Sauron 2.0 server arrancado en el puerto ${process.env.NODE_PORT || 3000} en modo: ${!process.env.NODE_ENV ? 'DEVELOPMENT' : process.env.NODE_ENV.toUpperCase()}`);
});
