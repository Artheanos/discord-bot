import config from "config";
import { openAiClient } from "initializers/openai";
import { TextBasedMessage } from "interfaces/discord";
import {
    ChatCompletionMessage,
    ChatCompletionMessageFunctionToolCall,
    ChatCompletionMessageToolCall,
} from "openai/resources/index";
import { PlayYoutubeUrlService } from "services/PlayYoutubeUrlService";
import { mergeObjects } from "utils/objects";
import aiInfo from "./info";
import { Conversation } from "./Conversation";

export class AiCompletion {
    constructor(
        private readonly message: TextBasedMessage,
        private readonly conversation: Conversation,
        private readonly onEdit: (
            messageIndex: number,
            content: string,
        ) => Promise<unknown>,
    ) {}

    async react() {
        let discordResponseEditedAt = 0;
        let messageIndex = -1;

        while (true) {
            messageIndex++;
            const aiMessage = {} as ChatCompletionMessage;

            const response = await this.createAiCompletion();
            for await (const chunk of response) {
                const delta = chunk.choices[0].delta;
                mergeObjects(aiMessage, delta);
                if (
                    delta.content &&
                    discordResponseEditedAt < Date.now() - 600
                ) {
                    discordResponseEditedAt = Date.now();
                    await this.onEdit(messageIndex, aiMessage.content!);
                }
            }
            this.conversation.add(aiMessage);

            if (aiMessage.tool_calls) {
                await this.handleToolCalls(aiMessage.tool_calls);
            } else {
                await this.onEdit(messageIndex, aiMessage.content!);
                break;
            }
        }

        console.log(this.conversation);
    }

    private createAiCompletion() {
        return openAiClient.chat.completions.create({
            model: config.ai.model,
            messages: this.conversation.messages,
            tools: aiInfo.tools({ inGuild: this.message.inGuild() }),
            stream: true,
        });
    }

    private async handleToolCalls(toolCalls: ChatCompletionMessageToolCall[]) {
        for (const toolCall of toolCalls as ChatCompletionMessageFunctionToolCall[]) {
            const { name, arguments: args } = toolCall.function;
            const addMessage = (content: string) => {
                this.conversation.add({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content,
                });
            };

            if (!this.message.inGuild()) return;

            if (name === "play_music") {
                const parsedArgs = JSON.parse(args);

                await new PlayYoutubeUrlService(
                    this.message,
                    parsedArgs.query,
                ).call();

                addMessage("success");
            } else if (name === "queue_action") {
                const parsedArgs = JSON.parse(args);

                setTimeout(() => {
                    this.conversation.addUserMessage(
                        this.message.author.username,
                        `[Scheduled]: ${parsedArgs.content}`,
                    );
                    this.react();
                }, parsedArgs.delay * 1000);
                addMessage("success");
            }
        }
    }
}
