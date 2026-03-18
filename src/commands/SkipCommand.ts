import { BaseCommand } from "./BaseCommand";

export class SkipCommand extends BaseCommand {
    static description = "Skips the current track";

    action() {
        this.getGuildExtension().playerWrapper.getPlayer()?.stop();
    }
}
