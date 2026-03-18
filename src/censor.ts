import configFile from "config"
import { Message } from "discord.js"

const { censorList } = configFile

export default function censor(msg: Message) {
    if (!msg.guildId) return

    if (msg.guildId in censorList || "*" in censorList) {
        const guild = censorList[msg.guildId]

        const banned_words = guild[msg.channelId] || guild["*"] || []

        for (const bannedWord of banned_words) {
            if (new RegExp(bannedWord).test(msg.content)) {
                msg.delete()
                return true
            }
        }
    }

    return false
}
