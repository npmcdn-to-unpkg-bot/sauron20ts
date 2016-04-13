"use strict";
exports.config = {
    database: {
        prod: {
            host: '10.0.100.118',
            user: 'ahg',
            password: 'jira12345',
            database: 'sauron'
        },
        dev: {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'sauron'
        }
    },
    log: {
        console: {
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            colorize: true
        }
    }
};
