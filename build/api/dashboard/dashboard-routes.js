"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_controller_1 = require("./dashboard-controller");
function default_1(server) {
    const dashboardController = new dashboard_controller_1.default();
    server.bind(dashboardController);
    server.route({
        method: "POST",
        path: "/dashboard",
        options: {
            handler: dashboardController.getDashboard,
            // auth: "jwt",
            tags: ["api", "users"],
            description: "User dashboard.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Dashboard Loaded."
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
