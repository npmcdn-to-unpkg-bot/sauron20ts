"use strict";
const express = require("express");
const path = require("path");
const util_1 = require("./util");
const config_1 = require("./config");
const morgan = require("morgan");
const templates = require("nunjucks");
const router_sprint_1 = require("./router-sprint");
const moment = require("moment");
moment.locale("es");
exports.app = express();
util_1.logger.debug("Overriding 'Express' logger");
exports.app.use(morgan("combined", { "stream": util_1.loggerStream }));
if (process.env.NODE_ENV == "production") {
    util_1.database.connect(config_1.config.database.prod);
}
else {
    util_1.database.connect(config_1.config.database.dev);
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
exports.app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
exports.app.use(express.static('public'));
util_1.logger.debug(path.join(__dirname, 'public'));
exports.app.use("/sprint", router_sprint_1.router);
exports.app.use("/test", (req, res, next) => {
    res.render("test");
});
exports.app.listen(process.env.NODE_PORT || 3000, () => {
    util_1.logger.info(`Sauron 2.0 server arrancado en el puerto ${process.env.NODE_PORT || 3000} en modo: ${!process.env.NODE_ENV ? 'DEVELOPMENT' : process.env.NODE_ENV.toUpperCase()}`);
});
