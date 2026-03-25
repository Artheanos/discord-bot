import { readFileSync } from "node:fs";
import { dmTools, guildTools } from "./tools";
import { join } from "node:path";

export default {
    systemPrompt: readFileSync(join(__dirname, "systemPrompt.md"), "utf-8"),
    tools: (options: { inGuild: boolean }) =>
        options.inGuild ? guildTools : dmTools,
};
