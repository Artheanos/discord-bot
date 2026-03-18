import { BaseCommand } from "./BaseCommand";
import { SavedTrack } from "@prisma/client";
import { prisma } from "initializers/prisma";

export class RenameCommand extends BaseCommand {
    static description = "Change the name of your saved track";
    static minArgsLength = 2;

    async action() {
        const [oldTitle, newTitle, ..._] = this.args;
        const track = await this.findByTitle(oldTitle);
        if (!track) return `Track ${oldTitle} doesn't exist`;
        if (await this.findByTitle(newTitle)) return `Track ${newTitle} already exists`;

        await prisma.savedTrack.update({ where: { id: track.id }, data: { title: newTitle } });
        return `Updated ${oldTitle} to ${newTitle}`;
    }

    findByTitle(title: string): Promise<SavedTrack | null> {
        return prisma.savedTrack.findFirst({ where: { title, userId: this.message.author.id } });
    }
}
