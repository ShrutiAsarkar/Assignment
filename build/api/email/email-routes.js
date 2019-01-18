"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_controller_1 = require("./email-controller");
function default_1(server) {
    const emailController = new email_controller_1.default();
    server.bind(emailController);
    server.route({
        method: "GET",
        path: "/email/send",
        options: {
            handler: emailController.sendEmail,
            // auth: "jwt",
            tags: ["api", "users"],
            description: "email dashboard.",
            // validate: {
            //     headers: UserValidator.jwtValidator
            // },
            plugins: {
                "hapi-swagger": {
                    responses: {
                        "200": {
                            description: "Email sent."
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
