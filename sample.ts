///<reference path='./typings/main.d.ts' />
"use strict";
//var config = require("./config");


/*
console.log(config);

config.get('log').console = null;

console.log(config.get('log').console);
    */

var immutable = require("immutable");

var kk = immutable.Seq.of({ edad: { a:[{x:10}] , b:2}});

//deepFreeze(kk2);


var oddSquares = immutable.Seq.of(1,2,3,4,5,6,7,8)
    .filter(x => x % 2).map(x => x * x);
console.log(oddSquares);

console.log(kk);

console.log(kk.get("edad"));

kk.get("edad").a = "mierda";



function deepFreeze(obj) {

    // Retrieve the property names defined on obj
    var propNames = Object.getOwnPropertyNames(obj);

    // Freeze properties before freezing self
    propNames.forEach(function(name) {
        var prop = obj[name];

        // Freeze prop if it is an object
        if (typeof prop == 'object' && prop !== null)
            deepFreeze(prop);
    });

    // Freeze self (no-op if already frozen)
    return Object.freeze(obj);
}