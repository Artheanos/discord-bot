import { ChatCompletionTool } from "openai/resources/index";

const tools = [
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
        onlyGuild: true,
    },
    {
        type: "function",
        function: {
            name: "queue_action",
            description: "Reminds you to do something after a delay",
            parameters: {
                type: "object",
                properties: {
                    content: {
                        type: "string",
                        description: "What to do after the delay",
                    },
                    delay: {
                        type: "integer",
                        description:
                            "Delay in seconds before sending the message",
                    },
                },
                required: ["content", "delay"],
            },
        },
    },
];

export const guildTools = tools.filter(
    (tool) => tool.onlyGuild,
) as ChatCompletionTool[];

export const dmTools = tools.filter(
    (tool) => !tool.onlyGuild,
) as ChatCompletionTool[];

for (let tool of tools) {
    delete tool.onlyGuild;
}
