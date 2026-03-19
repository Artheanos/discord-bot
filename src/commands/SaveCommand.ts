import { BaseCommand } from "./BaseCommand";
import { SaveValidator } from "validators/SaveValidator";
import { prisma } from "initializers/prisma";

export class SaveCommand extends BaseCommand {
    static description = "Save an audio file with a tag for easy access";
    static validator = SaveValidator;

    async action() {
        const title = await this.performSave();
        return `The track \`${title}\` has been saved`;
    }

    private async performSave(): Promise<string> {
        if (this.args[0]?.startsWith("http:")) {
            return this.saveUrl();
        } else {
            return this.saveFile();
        }
    }

    private async saveFile(): Promise<string> {
        const title =
            this.args.length > 0
                ? this.args.join(" ")
                : this.message.attachments.first()!.name;
        await this.createRecord(title, this.message.attachments.first()!.url);
        return title;
    }

    private async saveUrl(): Promise<string> {
        await this.createRecord(this.args[1], this.args[0]);
        return this.args[1];
    }

    private async createRecord(title: string, contentUrl: string) {
        await prisma.savedTrack.upsert({
            where: {
                userId_title: {
                    title,
                    userId: this.message.author.id,
                },
            },
            update: {
                contentUrl,
            },
            create: {
                contentUrl,
                title,
                userId: this.message.author.id,
            },
        });
    }
}
