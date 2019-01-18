"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_routes_1 = require("./email-routes");
function init(server) {
    email_routes_1.default(server);
}
exports.init = init;
