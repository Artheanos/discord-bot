import { BaseCommand } from "./BaseCommand";
import { JoinService } from "services/JoinService";

export class JoinCommand extends BaseCommand {
    static description = "Join the voice channel you are currently in";

    action() {
        new JoinService(this.message).call();
    }
}
