"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const employee_controller_1 = require("./employee-controller");
const Configs = require("../config");
function default_1(server) {
    let configs = Configs.getConfig();
    const employeeController = new employee_controller_1.default(configs);
    server.bind(employeeController);
    server.route({
        method: "GET",
        path: "/employees",
        options: {
            handler: employeeController.employeeController,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "Employee Base path.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Employee Base path."
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
        path: "/employees/create",
        options: {
            handler: employeeController.employeeCreationController,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "New Employee Creation.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "New Employee Creation."
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
        path: "/employees/list",
        options: {
            handler: employeeController.employeeList,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "New Employee Creation.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "New Employee Creation."
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
        path: "/employee/payroll/eligible/list",
        options: {
            handler: employeeController.payrollEligibleEmployeeList,
            // auth: "jwt",
            tags: ["api", "users", "company", "employee"],
            description: "New Employee Creation.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "New Employee Creation."
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
        path: "/employee/list/payroll",
        options: {
            handler: employeeController.payrollListEmployees,
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
