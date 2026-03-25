import { aiIntegration } from "ai/AiDiscordIntegration";
import censor from "censor";
import config from "config";
import { commandManager } from "initializers/commandManager";
import { TextBasedMessage } from "interfaces/discord";
import { ClientEventListener } from "./types";
import { DMChannel, GuildChannel } from "discord.js";

const allowedChannels = [DMChannel, GuildChannel];

const onMessageCreate: ClientEventListener<"messageCreate"> = (message) => {
    const messageIsFromTheApp = message.author.id === message.client.user!.id;
    if (messageIsFromTheApp || censor(message)) return;
    if (!allowedChannels.some((cls) => message.channel instanceof cls)) return;

    if (message.content.startsWith(config.aiPrefix) || !message.inGuild()) {
        aiIntegration.processMessage(message as TextBasedMessage);
    } else {
        commandManager.processMessage(message as TextBasedMessage<true>);
    }
};

export default onMessageCreate;
