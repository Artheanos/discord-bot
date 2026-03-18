import { Readable } from "stream";

export type QueuedTrack = {
    title: string
    stream: Readable
}
