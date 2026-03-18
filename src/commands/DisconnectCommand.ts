import { getVoiceConnection } from "@discordjs/voice";
import { BaseCommand } from "./BaseCommand";

export class DisconnectCommand extends BaseCommand {
    static description = "Disconnect command";

    action() {
        getVoiceConnection(this.guild.id)?.disconnect();
    }
}
