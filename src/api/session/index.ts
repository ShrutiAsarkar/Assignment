import * as Hapi from "hapi";
import Routes from "./session-routes";

export function init(server: Hapi.Server) {
    Routes(server);
}
