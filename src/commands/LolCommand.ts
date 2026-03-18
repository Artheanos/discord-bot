import { BaseCommand } from "./BaseCommand"
import { prisma } from "initializers/prisma"

export class LolCommand extends BaseCommand {
    static description = "Lolito"

    async action() {
        return "Hello world"
    }
}
