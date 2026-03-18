import config from "config";
import { Snowflake } from "discord.js";
import { openAiClient } from "initializers/openai";
import { TextChannelMessage } from "interfaces/TextChannelMessage";
import {
    ChatCompletionMessageFunctionToolCall,
    ChatCompletionMessageParam,
    ChatCompletionTool,
} from "openai/resources/index";
import { PlayYoutubeUrlService } from "services/PlayYoutubeUrlService";

export class AiIntegration {
    SYSTEM_PROMPT = "You are a discord bot. Use tools when needed.";
    TOOLS: ChatCompletionTool[] = [
        {
            type: "function",
            function: {
                name: "play_music",
                description: "Play music from youtube",
                parameters: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Query for youtube search",
                        },
                    },
                    required: ["query"],
                },
            },
        },
    ];
    private conversations: Record<Snowflake, ChatCompletionMessageParam[]> = {};

    constructor() {}

    async processMessage(message: TextChannelMessage) {
        const userInput = message.content.slice(config.prefix.length);
        if (userInput.trim() === "") return;
        const discordResponse = await message.channel.send("Thinking...");

        const conversation = this.getConversation(message.author.id);
        if (conversation.length === 0) {
            conversation.push({
                role: "system",
                content: this.SYSTEM_PROMPT,
            });
        }
        conversation.push({ role: "user", content: userInput });
        while (true) {
            console.log("Received", userInput, "sending", conversation);
            const response = await this.createCompletion(conversation);
            const aiMessage = response.choices[0].message;

            if (aiMessage.tool_calls) {
                for (const toolCall of aiMessage.tool_calls as ChatCompletionMessageFunctionToolCall[]) {
                    const { name, arguments: args } = toolCall.function;

                    if (name === "play_music") {
                        const parsedArgs = JSON.parse(args);
                        await parsedArgs.query;

                        await new PlayYoutubeUrlService(
                            message,
                            await parsedArgs.query,
                        ).call();

                        // Push tool result back to conversation
                        conversation.push(aiMessage);
                        conversation.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: "success",
                        });
                    }
                }
            } else {
                discordResponse.edit(aiMessage.content!);
                return;
            }
        }
    }

    createCompletion(conversation: ChatCompletionMessageParam[]) {
        return openAiClient.chat.completions.create({
            model: "gpt-5",
            messages: conversation,
            tools: this.TOOLS,
        });
    }

    private getConversation(userId: Snowflake): ChatCompletionMessageParam[] {
        if (!this.conversations[userId]) {
            this.conversations[userId] = [];
        }
        return this.conversations[userId];
    }
}

const tools = [
    {
        type: "function",
        function: {
            name: "get_package_status",
            description: "Get delivery status of a package",
            parameters: {
                type: "object",
                properties: {
                    tracking_number: {
                        type: "string",
                        description: "Tracking number of the package",
                    },
                },
                required: ["tracking_number"],
            },
        },
    },
];
