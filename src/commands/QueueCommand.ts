import { BaseCommand } from "./BaseCommand"
import { enumerateArray } from "utils/arrays"

export class QueueCommand extends BaseCommand {
    static description = "Show currently queued tracks"

    action() {
        const tracks = this.getGuildExtension().scheduler.queue
        return tracks.length ? enumerateArray(tracks.map(i => i.title)) : "Empty queue"
    }
}
