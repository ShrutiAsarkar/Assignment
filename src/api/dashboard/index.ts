import * as Hapi from "hapi";
import Routes from "./dashboard-routes";

export function init(server: Hapi.Server) {
    Routes(server);
}
