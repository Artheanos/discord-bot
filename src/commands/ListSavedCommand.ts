import { BaseCommand } from "./BaseCommand";
import { enumerateArray } from "utils/arrays";
import { prisma } from "initializers/prisma";

export class ListSavedCommand extends BaseCommand {
    static description = "Lists saved tracks";

    async action() {
        const tracks = await prisma.savedTrack.findMany({ where: { userId: this.message.author.id } });
        if (tracks.length === 0) {
            return "You don't have any saved tracks";
        }

        return enumerateArray(tracks.map(i => i.title));
    }
}