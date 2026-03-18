import "module-alias/register";

import config from "config";
import { onMessageCreate, onReady, onVoiceStateUpdate } from "listeners";
import { client } from "initializers/client";
import { prisma } from "initializers/prisma";

client.on("clientReady", onReady);
client.on("messageCreate", onMessageCreate);
client.on("voiceStateUpdate", onVoiceStateUpdate);

process.on("SIGTERM", () => {
    console.log("Closing.");
    prisma.$disconnect();
    client.destroy();
});

client.login(config.token);
