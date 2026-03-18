import { BaseCommand } from "./BaseCommand";
import { PlayYoutubeUrlService } from "services/PlayYoutubeUrlService";

export class PlayCommand extends BaseCommand {
    static minArgsLength = 1;
    static description = "Plays the first result form Youtube or a URL (if given a URL)";

    async action() {
        await new PlayYoutubeUrlService(this.message, this.args.join(" ")).call();
    }
}
