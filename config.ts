///<reference path='./typings/main.d.ts' />

const immutable = require("immutable");


export var config = immutable.Map({

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
            json: false,
            colorize: true
        },
        file: {
            level: 'info',
            filename: './logs/all-logs.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        }
    }

});

console.log(config);
