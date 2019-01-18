"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_routes_1 = require("./session-routes");
function init(server) {
    session_routes_1.default(server);
}
exports.init = init;
