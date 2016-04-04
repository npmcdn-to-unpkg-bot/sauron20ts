"use strict";
var immutable = require("immutable");
var kk = immutable.Seq.of({ edad: { a: [{ x: 10 }], b: 2 } });
var oddSquares = immutable.Seq.of(1, 2, 3, 4, 5, 6, 7, 8)
    .filter(x => x % 2).map(x => x * x);
console.log(oddSquares);
console.log(kk);
console.log(kk.get("edad"));
kk.get("edad").a = "mierda";
function deepFreeze(obj) {
    var propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(function (name) {
        var prop = obj[name];
        if (typeof prop == 'object' && prop !== null)
            deepFreeze(prop);
    });
    return Object.freeze(obj);
}
