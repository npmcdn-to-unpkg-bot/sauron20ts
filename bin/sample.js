"use strict";
const ImmutableJS = require("immutable");
var arr = [];
for (var i = 0; i < 10; i++) {
    var persona = {
        id: i,
        nombre: 'Antonio Hueso' + i,
        edad: 24,
        tipo: [1, 2, 3, 4, 5, 6]
    };
    arr.push(persona);
}
var kk = ImmutableJS.fromJS(arr);
kk.forEach(o => console.log(o));
