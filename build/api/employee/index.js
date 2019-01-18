"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employee_routes_1 = require("./employee-routes");
function init(server) {
    employee_routes_1.default(server);
}
exports.init = init;
