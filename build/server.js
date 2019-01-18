"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Hapi = require("hapi");
// import { IPlugin } from "./plugins/interfaces";
// import { IServerConfigurations } from "./configurations";
// import * as Logs from "./plugins/logging";
// import * as Tasks from "./api/tasks";
// import * as Users from "./api/users";
const Session = require("./api/session");
const Dashboard = require("./api/dashboard");
const Sequelize = require("sequelize");
const Configs = require("./api/config");
// import { IDatabase } from "./database";
async function init(
// configs: IServerConfigurations,
// database: IDatabase
) {
    try {
        const port = 5000; //process.env.PORT || configs.port;
        const server = new Hapi.Server({
            debug: { request: ['error'] },
            port: port,
            routes: {
                cors: {
                    origin: ["*"]
                }
            }
        });
        // if (configs.routePrefix) {
        //     server.realm.modifiers.route.prefix = configs.routePrefix;
        // }
        //  Setup Hapi Plugins
        // const plugins: Array<string> = configs.plugins;
        // const pluginOptions = {
        //     database: database,
        //     serverConfigs: configs
        // };
        // let pluginPromises: Promise<any>[] = [];
        //
        // plugins.forEach((pluginName: string) => {
        //     var plugin: IPlugin = require("./plugins/" + pluginName).default();
        //     console.log(
        //         `Register Plugin ${plugin.info().name} v${plugin.info().version}`
        //     );
        //     pluginPromises.push(plugin.register(server, pluginOptions));
        // });
        //
        // await Promise.all(pluginPromises);
        let dbConfig = Configs.getConfig();
        //console.log(dbConfig.get("sequelize_config"));
        await server.register([
            require('inert'),
            require('vision'),
            require('hapi-swagger'),
            {
                plugin: require('hapi-sequelizejs'),
                options: [
                    {
                        name: 'users_sq',
                        //models: [__dirname + '/models/*.js'],
                        models: [__dirname + '/models/*.js'],
                        //ignoredModels: ['./models/**/*.js'], // OPTIONAL: paths/globs to ignore files
                        sequelize: new Sequelize(dbConfig.get("database"), dbConfig.get("username"), dbConfig.get("password"), dbConfig.get("sequelize_config")),
                        sync: true,
                        forceSync: false,
                    },
                ],
            }
        ])
            .then(() => {
            console.log("All plugins registered successfully.");
        }, (reason) => {
            console.log("Plugin registration failed.");
            console.log("reason for failure : " + reason);
        });
        console.log("Register Routes");
        Session.init(server);
        Dashboard.init(server);
        console.log("Routes registered successfully.");
        return server;
    }
    catch (err) {
        console.log("Error starting server: ", err);
        throw err;
    }
}
exports.init = init;
