import { Message } from "discord.js";
import { spawn } from "child_process";

import { EnqueueTrackService } from "services/EnqueueTrackService";
import { JoinService } from "./JoinService";
import { Readable } from "stream";

export class PlayFileUrlService {
    constructor(
        private message: Message<true>,
        private track: VideoResult,
    ) {}

    async call() {
        await new JoinService(this.message).call();
        await this.enqueueTrack();
    }

    private async enqueueTrack() {
        await new EnqueueTrackService(this.message, {
            title: this.track.title,
            stream: this.createStream(),
        }).call();
    }

    private createStream(): Readable {
        return spawn("curl", [this.track.url, "-o", "-"]).stdout;
    }
}
