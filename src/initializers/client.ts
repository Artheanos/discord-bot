import { Client, GatewayIntentBits, Partials } from "discord.js"

export const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
})
