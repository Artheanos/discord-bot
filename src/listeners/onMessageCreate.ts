import censor from "censor";
import { ClientEventListener } from "./types";
import { commandManager } from "initializers/commandManager";

const onMessageCreate: ClientEventListener<"messageCreate"> = (message) => {
    const messageIsFromTheApp = message.author.id === message.client.user!.id;
    if (messageIsFromTheApp || censor(message)) return;

    if (message.inGuild()) {
        commandManager.processMessage(message);
    }
};

export default onMessageCreate;
