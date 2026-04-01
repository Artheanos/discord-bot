import { codeBlock } from "discord.js";

import { BaseCommand } from "./BaseCommand";
import { enumerateArray } from "utils/arrays";
import { PlayYoutubeUrlService } from "services/PlayYoutubeUrlService";
import { search } from "lib/yt-dlp";
import { waitForNumberReaction } from "services/waitForNumberReaction";

export class SearchCommand extends BaseCommand {
    static description = "Search for youtube videos and choose one of them";
    static minArgsLength = 1;

    async action() {
        const video = await this.getVideoFromUser();
        if (video) {
            await new PlayYoutubeUrlService(this.message, video.url).call();
        }
    }

    private async getVideoFromUser() {
        const videos = await search(this.args.join(" "), 5);
        const videoListMessage = await this.reply(
            codeBlock(enumerateArray(videos.map((v) => v.title))),
        );
        const userResponse = await waitForNumberReaction(
            videoListMessage,
            this.message.author.id,
        );
        const videoIndex = Number(userResponse) - 1;

        if (isNaN(videoIndex)) {
            return;
        }

        if (!(videoIndex in videos)) {
            await this.reply(`Invalid choice ${userResponse}`);
            return;
        }

        return videos[videoIndex];
    }
}
