"use strict";
const ImmutableJS = require("immutable");
var c = ImmutableJS.fromJS({ a: 1, b: 2 });
var s = ImmutableJS.fromJS(["una", "dola"]);
kk(c, s);
console.log(c, s);
function kk(o, arr) {
    console.log(o);
    o = o.set("a", "Mierda");
    console.log(o);
    arr = null;
}
