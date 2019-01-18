"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_controller_1 = require("./wallet-controller");
function default_1(server) {
    const walletController = new wallet_controller_1.default();
    server.bind(walletController);
    server.route({
        method: "POST",
        path: "/wallet",
        options: {
            handler: walletController.walletController,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "payment Base path.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "wallet Base path."
                        },
                        "401": {
                            description: "Please login."
                        }
                    }
                }
            }
        }
    });
}
exports.default = default_1;
