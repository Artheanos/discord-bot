import {
    AudioPlayer,
    AudioPlayerState,
    createAudioPlayer,
    getVoiceConnection,
    NoSubscriberBehavior,
} from "@discordjs/voice";

type PlayerListener = (state: AudioPlayerState) => void

export class AudioPlayerWrapper {
    private player?: AudioPlayer;
    private listener?: PlayerListener;

    constructor(
        private readonly guildId: string,
    ) {
    }

    getPlayer(): AudioPlayer | undefined {
        if (!this.player) {
            this.createSubscribedPlayer();
        }

        return this.player;
    }

    setListener(listener: PlayerListener) {
        this.listener = listener;
    }

    private createSubscribedPlayer() {
        const connection = getVoiceConnection(this.guildId);

        if (!connection) {
            throw `Client is not in any voice channel belonging to the guild#${this.guildId}`;
        }

        connection.on("stateChange", (oldState, newState) => {
            if (newState.status === "disconnected" || newState.status === "destroyed") {
                delete this.player;
            }
        });

        const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
        connection?.subscribe(player);
        player.on("stateChange", (_, newState) => this.listener?.(newState));
        this.player = player;
    }
}
