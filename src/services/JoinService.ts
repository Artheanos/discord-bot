import {
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus,
} from "@discordjs/voice"
import { Message } from "discord.js"
import { FriendlyError } from "errors/FriendlyError"

export class JoinService {
    constructor(private message: Message) {
    }

    call(): Promise<VoiceConnection> {
        return new Promise((resolve: (connection: VoiceConnection) => void, reject) => {
            const connection = this.joinVoice()

            if (!connection) {
                return reject(new FriendlyError("User not in a voice channel"))
            }

            if (connection.state.status === VoiceConnectionStatus.Ready) {
                return resolve(connection)
            }

            connection.on(VoiceConnectionStatus.Ready, () => {
                resolve(connection)
            })

            setTimeout(() => reject(new FriendlyError("Joining timeout")), 10_000)
        })
    }

    private joinVoice(): VoiceConnection | undefined {
        const guild = this.message.guild
        const voiceChannelId = this.message.member?.voice.channelId

        if (!voiceChannelId) return

        return joinVoiceChannel({
            channelId: voiceChannelId,
            guildId: guild!.id,
            adapterCreator: guild!.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        })
    }
}
