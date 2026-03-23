import config from "config";
import OpenAI from "openai";

export const openAiClient = new OpenAI({
    baseURL: config.ai.baseURL,
    apiKey: config.ai.openAiKey,
});
