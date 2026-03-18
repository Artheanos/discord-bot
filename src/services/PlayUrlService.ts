import { Message } from "discord.js"
import { spawn } from "child_process"

import { EnqueueTrackService } from "services/EnqueueTrackService"
import { JoinService } from "./JoinService"
import { Readable } from "stream"

export class PlayUrlService {
    constructor(private message: Message<true>, private track: VideoResult) {
    }

    async call() {
        try {
            await new JoinService(this.message).call()
            await this.enqueueTrack()
        } catch (e: any) {
            console.error(e)
            this.message.channel.send(e.toString())
        }
    }

    private async enqueueTrack() {
        await new EnqueueTrackService(
            this.message,
            { title: this.track.title, stream: this.createStream() },
        ).call()
    }

    private createStream(): Readable {
        return spawn("curl", [this.track.url, "-o", "-"]).stdout
    }
}
