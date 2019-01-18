import * as Hapi from "hapi";
import DashboardController from "./dashboard-controller";

export default function(
    server: Hapi.Server,
) {
    const dashboardController = new DashboardController();
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
