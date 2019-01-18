"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payroll_controller_1 = require("./payroll-controller");
function default_1(server) {
    const payrollController = new payroll_controller_1.default();
    server.bind(payrollController);
    server.route({
        method: "GET",
        path: "/payroll",
        options: {
            handler: payrollController.payrollController,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "payroll Base path.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "payroll Base path."
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
        path: "/payroll/create",
        options: {
            handler: payrollController.payrollCreationController,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "New payroll Creation.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "New payroll Creation."
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
        path: "/payroll/run",
        options: {
            handler: payrollController.runPayroll,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "New payroll Creation.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "New payroll Creation."
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
        path: "/payroll/list",
        options: {
            handler: payrollController.payrollList,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "List payrolls.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "List payrolls."
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
