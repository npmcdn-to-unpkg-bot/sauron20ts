"use strict";
const winston_1 = require("winston");
exports.logger = new winston_1.Logger({
    transports: [
        new winston_1.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});
exports.stream = {
    write: (message) => {
        exports.logger.info(message);
    }
};
