import * as Hapi from "hapi";

import SessionController from "./session-controller";
import * as Configs from "../config";


export default function(
    server: Hapi.Server,
) {
    let configs = Configs.getConfig();
    const sessionController = new SessionController(configs);
    server.bind(sessionController);
    server.route({
        method: "GET",
        path: "/session/login/employee",
        options: {
            pre: [{
                method: function() {
                    return configs.get("Roles").Auth_req.Employee_login;
                },
                assign: "role"
            }],
            handler: sessionController.loginUser,
            // auth: "jwt",
            tags: ["api", "users"],
            description: "Login user.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "User founded."
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
        method: "GET",
        path: "/session/signup/employee",
        options: {
            pre: [{
                method: function() {
                    return 'Employee';
                },
                assign: "role"
            }],
            handler: sessionController.signupUser,
            // auth: "jwt",
            tags: ["api", "users", "employer"],
            description: "Signup user.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "User Signed Up."
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
        method: "GET",
        path: "/session/uphold/oauth",
        options: {
            handler: sessionController.uphold,
            // auth: "jwt",
            tags: ["api", "users", "uphold"],
            description: "Uphold Oauth Endpoint.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "User founded."
                        },
                        "401": {
                            description: "Please login."
                        }
                    }
                }
            }
        }
    });

    // server.route({
    //     method: "POST",
    //     path: "/session/auth",
    //     options: {
    //         handler: sessionController.authenticate,
    //         auth: false,
    //         tags: ["api", "users"],
    //         description: "Authenticate user.",
    //         validate: {
    //             payload: UserValidator.createUserModel
    //         },
    //         plugins: {
    //             "hapi-swagger": {
    //                 responses: {
    //                     "201": {
    //                         description: "User created."
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // });

}
