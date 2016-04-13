"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const util_1 = require("./util");
const config_1 = require("./config");
util_1.database.connect(config_1.config.database.dev);
function q() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var sprint = yield util_1.database.queryForOne("Select * from sprint where id = ?", [36]);
        }
        catch (e) {
            console.log("PAHA");
            util_1.logger.error(e);
        }
    });
}
q();
