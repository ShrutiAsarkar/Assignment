"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_routes_1 = require("./wallet-routes");
function init(server) {
    wallet_routes_1.default(server);
}
exports.init = init;
