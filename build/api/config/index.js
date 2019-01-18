"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nconf = require("nconf");
//Read Configurations
//todo: needs fixing for dynamic path
const configs = new nconf.Provider({
    env: true,
    argv: true,
    store: {
        type: "file",
        file: "./build/api/config/config.dev.json"
    }
});
function getConfig() {
    return configs;
}
exports.getConfig = getConfig;
