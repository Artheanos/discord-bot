import config from "config";
import { Snowflake } from "discord.js";
import { TextBasedMessage } from "interfaces/discord";
import { AiCompletion } from "./AiCompletion";
import { Conversation } from "./Conversation";

class AiDiscordIntegration {
    private conversations: Record<Snowflake, Conversation> = {};

    async processMessage(message: TextBasedMessage) {
        const userInput = this.getUserInput(message);
        if (userInput === "") return;

        const discordResponses = [await message.channel.send("Thinking...")];
        const conversation = this.getOrCreateConversation(message.channel.id);
        conversation.addUserMessage(message.author.username, userInput);

        const aiCompletion = new AiCompletion(
            message,
            conversation,
            async (msgIndex, content) => {
                discordResponses[msgIndex] ||=
                    await message.channel.send("Thinking...");
                if (content) {
                    await discordResponses[msgIndex].edit(content);
                } else {
                    await discordResponses[msgIndex].delete();
                }
            },
        );
        await aiCompletion.react();
    }

    private getOrCreateConversation(sessionId: Snowflake): Conversation {
        this.conversations[sessionId] ||= new Conversation();
        return this.conversations[sessionId];
    }

    private getUserInput(message: TextBasedMessage): string {
        let result = "";
        if (message.content.startsWith(config.aiPrefix)) {
            result = message.content.slice(config.aiPrefix.length);
        } else {
            result = message.content;
        }
        return result.trim();
    }
}

export const aiIntegration = new AiDiscordIntegration();
