"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_controller_1 = require("./payment-controller");
function default_1(server) {
    const paymentController = new payment_controller_1.default();
    server.bind(paymentController);
    server.route({
        method: "POST",
        path: "/payment",
        options: {
            handler: paymentController.paymentController,
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
                            description: "payment Base path."
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
