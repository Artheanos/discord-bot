import config from "config";
import aiInfo from "./info";
import { Snowflake } from "discord.js";
import { openAiClient } from "initializers/openai";
import { TextChannelMessage } from "interfaces/TextChannelMessage";
import {
    ChatCompletionMessage,
    ChatCompletionMessageFunctionToolCall,
    ChatCompletionMessageParam,
    ChatCompletionMessageToolCall,
    ChatCompletionTool,
} from "openai/resources/index";
import { PlayYoutubeUrlService } from "services/PlayYoutubeUrlService";
import { mergeObjects } from "utils/objects";

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
        let discordResponseEditedAt = 0;
        const conversation = this.getOrCreateConversation(message.channel.id);
        conversation.push({
            role: "user",
            content: `User(${message.author.username}):${userInput}`,
        });

        while (true) {
            const aiMessage = {} as ChatCompletionMessage;

            const response = await this.createAiCompletion(conversation);
            for await (const chunk of response) {
                const delta = chunk.choices[0].delta;
                mergeObjects(aiMessage, delta);
                if (
                    delta.content &&
                    discordResponseEditedAt < Date.now() - 600
                ) {
                    discordResponseEditedAt = Date.now();
                    await discordResponse.edit(aiMessage.content!);
                }
            }
            conversation.push(aiMessage);

            if (aiMessage.tool_calls) {
                await this.handleToolCalls(
                    aiMessage.tool_calls,
                    conversation,
                    message,
                );
            } else {
                if (aiMessage.content) {
                    await discordResponse.edit(aiMessage.content!);
                } else {
                    await discordResponse.delete();
                }
                return;
            }
        }
    }

    private createAiCompletion(conversation: ChatCompletionMessageParam[]) {
        return openAiClient.chat.completions.create({
            model: config.ai.model,
            messages: conversation,
            tools: aiInfo.tools as ChatCompletionTool[],
            stream: true,
        });
    }

    private getOrCreateConversation(
        sessionId: Snowflake,
    ): ChatCompletionMessageParam[] {
        if (!this.conversations[sessionId]) {
            this.conversations[sessionId] = [
                {
                    role: "system",
                    content: aiInfo.systemPrompt,
                },
            ];
        }
        return this.conversations[sessionId];
    }

    private async handleToolCalls(
        toolCalls: ChatCompletionMessageToolCall[],
        conversation: ChatCompletionMessageParam[],
        message: TextChannelMessage,
    ) {
        for (const toolCall of toolCalls as ChatCompletionMessageFunctionToolCall[]) {
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
