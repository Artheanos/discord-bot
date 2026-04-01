import config from "config";
import { Message, Snowflake } from "discord.js";
import { TextBasedMessage } from "interfaces/discord";
import { AiCompletion } from "./AiCompletion";
import { Conversation } from "./Conversation";
import { emojis } from "lib/emojis";
import { randomItem } from "utils/random";

class AiDiscordIntegration {
    private conversations: Record<Snowflake, Conversation> = {};

    async processMessage(message: TextBasedMessage) {
        const userInput = this.getUserInput(message);
        if (userInput === "") return;

        const thinkingReaction = message.react(randomItem(emojis));
        const discordResponses: Message[] = [];
        const conversation = this.getOrCreateConversation(message.channel.id);
        conversation.addUserMessage(message.author.username, userInput);

        const aiCompletion = new AiCompletion(
            message,
            conversation,
            async (msgIndex, content) => {
                if (discordResponses[msgIndex]) {
                    await this.updateBotMessage(
                        discordResponses[msgIndex],
                        content,
                    );
                } else if (content) {
                    discordResponses[msgIndex] =
                        await message.channel.send(content);
                }
            },
        );
        await aiCompletion.react();
        thinkingReaction.then((reaction) => reaction.remove());
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

    private async updateBotMessage(
        msg: Message,
        content: string | undefined,
    ): Promise<unknown> {
        if (content) {
            return msg.edit(content);
        } else {
            return msg.delete();
        }
    }
}

export const aiIntegration = new AiDiscordIntegration();
