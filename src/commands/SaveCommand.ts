import { BaseCommand } from "./BaseCommand";
import { SaveValidator } from "validators/SaveValidator";
import { prisma } from "initializers/prisma";

export class SaveCommand extends BaseCommand {
    static description = "Save an audio file with a tag for easy access";
    static minArgsLength = 1;
    static validator = SaveValidator;

    async action() {
        await this.performSave();
        return `The track \`${this.title}\` has been saved`;
    }

    private async performSave() {
        if (this.args.length === 1) {
            await this.saveFile();
        } else {
            await this.saveUrl();
        }
    }

    private async saveFile() {
        await this.createRecord(this.message.attachments.first()!.url);
    }

    private async saveUrl() {
        await this.createRecord(this.args[1]);
    }

    private async createRecord(contentUrl: string) {
        await prisma.savedTrack.upsert({
            where: {
                userId_title: {
                    title: this.title,
                    userId: this.message.author.id,
                },
            },
            update: {
                contentUrl,
            },
            create: {
                contentUrl,
                title: this.title,
                userId: this.message.author.id,
            },
        });
    }

    private get title(): string {
        return this.args[0];
    }
}
