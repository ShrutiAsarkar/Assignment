"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_routes_1 = require("./payment-routes");
function init(server) {
    payment_routes_1.default(server);
}
exports.init = init;
