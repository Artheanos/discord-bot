import config from "config";
import { Snowflake } from "discord.js";
import { openAiClient } from "initializers/openai";
import { TextChannelMessage } from "interfaces/TextChannelMessage";
import {
    ChatCompletionMessage,
    ChatCompletionMessageFunctionToolCall,
    ChatCompletionMessageParam,
    ChatCompletionTool,
} from "openai/resources/index";
import { PlayYoutubeUrlService } from "services/PlayYoutubeUrlService";
import * as aiConfig from "./aiConfig.json";

export class AiIntegration {
    private conversations: Record<Snowflake, ChatCompletionMessageParam[]> = {};

    async processMessage(message: TextChannelMessage) {
        const userInput = message.content.slice(config.prefix.length);
        if (userInput.trim() === "") return;
        const discordResponse = await message.channel.send("Thinking...");

        const conversation = this.getOrCreateConversation(message.channel.id);
        conversation.push({ role: "user", content: userInput });
        while (true) {
            console.log("Received", userInput, "sending", conversation);
            const response = await this.createAiCompletion(conversation);
            const aiMessage = response.choices[0].message;
            conversation.push(aiMessage);

            if (aiMessage.tool_calls) {
                this.handleToolCalls(aiMessage, conversation, message);
            } else {
                discordResponse.edit(aiMessage.content!);
                return;
            }
        }
    }

    createAiCompletion(conversation: ChatCompletionMessageParam[]) {
        return openAiClient.chat.completions.create({
            model: "gpt-5",
            messages: conversation,
            tools: aiConfig.tools as ChatCompletionTool[],
        });
    }

    private getOrCreateConversation(
        sessionId: Snowflake,
    ): ChatCompletionMessageParam[] {
        if (!this.conversations[sessionId]) {
            this.conversations[sessionId] = [
                {
                    role: "system",
                    content: aiConfig.systemPrompt,
                },
            ];
        }
        return this.conversations[sessionId];
    }

    private async handleToolCalls(
        aiMessage: ChatCompletionMessage,
        conversation: ChatCompletionMessageParam[],
        message: TextChannelMessage,
    ) {
        for (const toolCall of aiMessage.tool_calls as ChatCompletionMessageFunctionToolCall[]) {
            const { name, arguments: args } = toolCall.function;

            if (name === "play_music") {
                const parsedArgs = JSON.parse(args);
                await parsedArgs.query;

                await new PlayYoutubeUrlService(
                    message,
                    await parsedArgs.query,
                ).call();

                conversation.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: "success",
                });
            }
        }
    }
}
