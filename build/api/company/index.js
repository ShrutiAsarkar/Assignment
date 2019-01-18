"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const company_routes_1 = require("./company-routes");
function init(server) {
    company_routes_1.default(server);
}
exports.init = init;
