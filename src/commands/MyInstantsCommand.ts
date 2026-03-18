import { BaseCommand } from "./BaseCommand";
import * as myinstants from "lib/myinstants";
import { PlayFileUrlService } from "services/PlayFileUrlService";
import { choice } from "utils/random";

export class MyInstantsCommand extends BaseCommand {
    static description = `Search for mp3s on ${myinstants.BASE_URL}`;
    static minArgsLength = 1;
    static DEFAULT_TRACK_NAME = "MP3";

    async action(): Promise<string | void> {
        const infoMessage = this.channel.send("Searching");
        const track = await this.getTrack();
        if (!track) {
            infoMessage.then((i) => i.edit("No results"));
            return;
        }

        await new PlayFileUrlService(this.message, track).call();
        infoMessage.then((msg) => msg.delete());
    }

    async getTrack(): Promise<VideoResult | null> {
        const mp3s = await myinstants.findMp3Paths(this.args.join(" "));
        if (mp3s.length === 0) return null;

        const mp3Path = choice(mp3s);

        return {
            url: myinstants.getMediaUrl(mp3Path),
            title:
                mp3Path.split("/").at(-1) ||
                MyInstantsCommand.DEFAULT_TRACK_NAME,
        };
    }
}
