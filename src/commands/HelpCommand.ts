import { BaseCommand } from "./BaseCommand"
import { routes } from "routes"


export class HelpCommand extends BaseCommand {
    static description = "Help yourself"

    action() {
        if (this.args.length === 0) {
            return `Available commands are \n${HelpCommand.formatRoutes(Object.keys(routes))}`
        } else {
            return HelpCommand.getDescription(this.args[0])
        }
    }

    private static formatRoutes(routes: string[]) {
        return `\`${routes.join("` `")}\``
    }

    private static getDescription(route: string) {
        return (routes[route] as unknown as typeof BaseCommand).description
    }
}
