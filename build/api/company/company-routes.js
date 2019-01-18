"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const company_controller_1 = require("./company-controller");
function default_1(server) {
    const companyController = new company_controller_1.default();
    server.bind(companyController);
    server.route({
        method: "GET",
        path: "/companies",
        options: {
            handler: companyController.companyController,
            // auth: "jwt",
            tags: ["api", "users", "company"],
            description: "Company Base path.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Company Base route."
                        },
                        "401": {
                            description: "Please login."
                        }
                    }
                }
            }
        }
    });
    server.route({
        method: "POST",
        path: "/companies/create",
        options: {
            handler: companyController.companySetupController,
            // auth: "jwt",
            tags: ["api", "users", "company"],
            description: "New company creation.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "New company creation."
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
