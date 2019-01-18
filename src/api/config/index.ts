import * as nconf from "nconf";
import * as path from "path";

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

export function getConfig() {
    return configs;
}
