///<reference path='./typings/main.d.ts' />
"use strict";
//var config = require("./config");

const ImmutableJS = require("immutable");
import * as _ from "underscore";

var c = ImmutableJS.fromJS({ a:1, b:2});
var s = ImmutableJS.fromJS([ "una", "dola"]);

kk(c,s);

console.log(c,s);

function kk(o:any,arr:Array<string>): void {
    console.log(o);
    o = o.set("a", "Mierda");
    console.log(o);
    arr = null;
}