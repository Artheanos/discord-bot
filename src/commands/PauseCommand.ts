import { BaseCommand } from "./BaseCommand"

export class PauseCommand extends BaseCommand {
    static description = "Pauses the player"

    action() {
        this.getGuildExtension().playerWrapper.getPlayer()?.pause()
    }
}
