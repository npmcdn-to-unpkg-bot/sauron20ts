"use strict";
const express = require("express");
const path = require("path");
const logger_1 = require("./logger");
const morgan = require("morgan");
const moment = require("moment");
moment.locale("es");
exports.app = express();
logger_1.logger.debug("Overriding 'Express' logger");
exports.app.use(morgan("combined", { "stream": logger_1.stream }));
exports.app.use('/static', express.static(path.join(__dirname, 'public')));
exports.app.use("/test", (req, res, next) => {
    res.send("Hello World");
});
exports.app.listen(3000, () => {
    logger_1.logger.info("Sauron 2.0 server arrancado en modo: ", !process.env.NODE_ENV ? 'development' : process.env.NODE_ENV);
});
