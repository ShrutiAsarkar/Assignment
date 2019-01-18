"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = require("./user-routes");
function init(server) {
    user_routes_1.default(server);
}
exports.init = init;
