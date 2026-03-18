import { GuildExtensionsManager } from "lib/guildStorage"
import { QueuedTrack } from "lib/guildStorage/types"
import { Message } from "discord.js"

export class EnqueueTrackService {
    constructor(private message: Message<true>, private track: QueuedTrack, private infoMessage?: Message) {
    }

    async call() {
        const scheduler = GuildExtensionsManager.getGuildExtension(this.message.guildId!).scheduler
        await scheduler.enqueue(this.track)

        if (scheduler.currentTrack) {
            await this.displayInfo(`Enqueued \`${this.track.title}\``)
        } else {
            await this.displayInfo(`Now playing \`${this.track.title}\``)
        }
    }

    async displayInfo(content: string): Promise<unknown> {
        if (this.infoMessage) {
            return this.infoMessage.edit(content)
        } else {
            return this.message.channel.send(content)
        }
    }
}