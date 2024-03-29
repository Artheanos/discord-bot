import 'module-alias/register'
import { Client, GatewayIntentBits, Partials } from 'discord.js'

import config from 'config'
import { CommandManager } from 'CommandManager'
import { onReady, onMessageCreate, onVoiceStateUpdate } from 'clientListeners'
import { PrismaClient } from '@prisma/client'

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

export const commandManager = new CommandManager(client)

export const prisma = new PrismaClient()

client.on('ready', onReady)
client.on('messageCreate', onMessageCreate)
client.on('voiceStateUpdate', onVoiceStateUpdate)

process.on('SIGTERM', () => {
    console.log('Closing.')
    prisma.$disconnect()
    client.destroy()
})

client.login(config.token)
