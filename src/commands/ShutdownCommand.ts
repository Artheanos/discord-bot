import { BaseCommand } from './BaseCommand'
import { GuildStorage } from 'lib/guildStorage'

export class ShutdownCommand extends BaseCommand {
    static description = 'Stops the bot'
    static ownerOnly = true

    action() {
        for (const { scheduler, playerWrapper } of Object.values(GuildStorage.guilds)) {
            for (const track of [...scheduler.queue]) {
                track.stream.destroy()
            }
            // @ts-ignore
            playerWrapper.player?.stop()
            scheduler.currentTrack?.stream.destroy()
        }
        this.client.destroy()
    }
}
