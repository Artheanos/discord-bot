import { BaseCommand } from "./BaseCommand";

export class UnpauseCommand extends BaseCommand {
    static description = "Unpauses the player";

    action() {
        this.getGuildExtension().playerWrapper.getPlayer()?.unpause();
    }
}
