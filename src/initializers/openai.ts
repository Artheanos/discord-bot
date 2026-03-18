import config from "config";
import OpenAI from "openai";

export const openAiClient = new OpenAI({
    apiKey: config.openAiKey,
});
