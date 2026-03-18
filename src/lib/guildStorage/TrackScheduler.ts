import { AudioPlayerState, AudioPlayerStatus, createAudioResource } from "@discordjs/voice";
import { AudioPlayerWrapper } from "./AudioPlayerWrapper";
import { QueuedTrack } from "lib/guildStorage/types";

export class TrackScheduler {
    queue: QueuedTrack[] = [];
    currentTrack?: QueuedTrack;

    constructor(private readonly playerWrapper: AudioPlayerWrapper) {
    }

    get player() {
        return this.playerWrapper.getPlayer();
    }

    async enqueue(trackStream: QueuedTrack) {
        this.queue.push(trackStream);
        if (!this.isPlaying()) {
            this.playNext();
        }
    }

    playNext() {
        delete this.currentTrack;
        const player = this.player;
        if (player) {
            const nextSong = this.queue.shift();
            if (nextSong) {
                player.play(createAudioResource(nextSong.stream));
                this.currentTrack = nextSong;
            }
        }
    }

    onPlayerStateChange(newState: AudioPlayerState) {
        if (newState.status === AudioPlayerStatus.Idle) {
            this.playNext();
        }
    }

    private isPlaying() {
        return this.player?.state.status === AudioPlayerStatus.Playing;
    }
}
