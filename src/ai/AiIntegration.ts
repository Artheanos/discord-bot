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

    async processMessage(
        message: TextChannelMessage,
        overrideContent?: string,
    ) {
        const userInput =
            overrideContent ?? message.content.slice(config.prefix.length);
        if (userInput.trim() === "") return;
        const discordResponse = await message.channel.send("Thinking...");

        const conversation = this.getOrCreateConversation(message.channel.id);
        conversation.push({ role: "user", content: userInput });
        while (true) {
            const response = await this.createAiCompletion(conversation);
            const aiMessage = response.choices[0].message;
            conversation.push(aiMessage);

            if (aiMessage.tool_calls) {
                await this.handleToolCalls(aiMessage, conversation, message);
            } else {
                discordResponse.edit(aiMessage.content!);
                return;
            }
        }
    }

    private createAiCompletion(conversation: ChatCompletionMessageParam[]) {
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
            const addMessage = (content: string) => {
                conversation.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content,
                });
            };

            if (name === "play_music") {
                const parsedArgs = JSON.parse(args);

                await new PlayYoutubeUrlService(
                    message,
                    parsedArgs.query,
                ).call();

                addMessage("success");
            } else if (name === "queue_action") {
                const parsedArgs = JSON.parse(args);

                setTimeout(() => {
                    this.processMessage(
                        message,
                        `[Scheduled]: ${parsedArgs.content}`,
                    );
                }, parsedArgs.delay * 1000);
                addMessage("success");
            }
        }
    }
}
