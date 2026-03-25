import { ChatCompletionMessageParam } from "openai/resources/index";
import aiInfo from "./info";

export class Conversation {
    public readonly messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: aiInfo.systemPrompt,
        },
    ];

    add(msg: ChatCompletionMessageParam) {
        this.messages.push(msg);
    }

    addUserMessage(username: string, content: string) {
        this.messages.push({
            role: "user",
            content: `User(${username}):${content}`,
        });
    }
}
