"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payroll_routes_1 = require("./payroll-routes");
function init(server) {
    payroll_routes_1.default(server);
}
exports.init = init;
