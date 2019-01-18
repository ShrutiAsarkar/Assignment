"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_routes_1 = require("./dashboard-routes");
function init(server) {
    dashboard_routes_1.default(server);
}
exports.init = init;
