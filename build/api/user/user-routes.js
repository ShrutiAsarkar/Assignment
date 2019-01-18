"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./user-controller");
function default_1(server) {
    const userController = new user_controller_1.default();
    server.bind(userController);
    server.route({
        method: "POST",
        path: "/user/employee/account",
        options: {
            handler: userController.getEmployeeAccountdetails,
            // auth: "jwt",
            tags: ["api", "users"],
            description: "User profile.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Profile Loaded."
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
        path: "/user/employer/account/acc",
        options: {
            handler: userController.getEmployerAccountdetails,
            // auth: "jwt",
            tags: ["api", "users"],
            description: "User profile.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Profile Loaded."
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
// needs work
