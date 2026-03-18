import { Message } from "discord.js";

import { getTitle, search, stream } from "lib/yt-dlp";
import { isValidURL } from "utils/strings";
import { JoinService } from "./JoinService";
import { QueuedTrack } from "lib/guildStorage/types";
import { EnqueueTrackService } from "services/EnqueueTrackService";

export class PlayYoutubeUrlService {
    constructor(private message: Message<true>, private track: string) {
    }

    async call(): Promise<void> {
        try {
            await new JoinService(this.message).call();
            this.enqueueTrack();
        } catch (e: any) {
            this.message.channel.send(e.toString());
        }
    }

    private enqueueTrack(): void {
        Promise.all([
            this.message.channel.send("Downloading"),
            this.getVideoInfo(),
        ]).then(([responseMessage, videoInfo]) => {
            new EnqueueTrackService(this.message, videoInfo, responseMessage).call();
        });
    }

    private async getVideoInfo(): Promise<QueuedTrack> {
        const video = isValidURL(this.track) ? {
            url: this.track,
            title: await getTitle(this.track),
        } : await this.getFirstResultFromYoutube();

        return { ...video, stream: stream(video.url) };
    }

    private async getFirstResultFromYoutube(): Promise<VideoResult> {
        return (await search(this.track, 1))[0];
    }
}
