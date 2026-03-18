import { BaseCommand } from "./BaseCommand";

export class DeleteCommand extends BaseCommand {
    static description = "Deletes as many messages as you'd like";
    static minArgsLength = 1;

    static MAX_MESSAGE_COUNT = 50;

    async action() {
        const messageCount = Number(this.args[0]);

        if (isNaN(messageCount)) {
            return `${this.args[0]} is not a number`;
        }
        if (messageCount > DeleteCommand.MAX_MESSAGE_COUNT || messageCount < 0) {
            return `Out of range (0, ${DeleteCommand.MAX_MESSAGE_COUNT})`;
        }

        await this.channel.bulkDelete(messageCount + 1);
        const replyMessage = await this.reply(`I deleted \`${messageCount}\` messages`);
        setTimeout(() => replyMessage.delete(), 5_000);
    }
}
