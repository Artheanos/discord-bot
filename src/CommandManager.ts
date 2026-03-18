import { Client, Message, SendableChannels } from "discord.js";

import config from "config";
import { FriendlyError } from "errors/FriendlyError";
import { routes } from "routes";
import { TextChannelMessage } from "interfaces/TextChannelMessage";
import { tmpSend } from "utils/discord";

import { HelpCommand } from "commands/HelpCommand";
import { BaseCommand } from "commands/BaseCommand";
import { AiIntegration } from "ai/AiIntegration";

// HelpCommand references `routes`, so it has to be added
// after the `routes` have been initialized
routes["help"] = HelpCommand;
const aiIntegration = new AiIntegration();

export class CommandManager {
    constructor(private client: Client) {}

    processMessage(message: Message<true>) {
        if (message.content.startsWith(config.aiPrefix)) {
            // ai handling should not be here
            aiIntegration.processMessage(message as TextChannelMessage);
            return;
        }

        if (message.content.startsWith(config.prefix)) {
            const commandName = CommandManager.resolveCommandName(message);

            if (commandName in routes) {
                this.performCommand(commandName, message as TextChannelMessage);
            } else {
                CommandManager.unknownCommandMessage(
                    message.channel,
                    commandName,
                );
            }
        }
    }

    private performCommand(name: string, message: TextChannelMessage) {
        const commandClass: Type<BaseCommand> = routes[name];
        const commandProps = [message as TextChannelMessage, this.client];
        const commandInstance: BaseCommand = new commandClass(...commandProps);

        commandInstance.perform().catch((e) => {
            if (e instanceof FriendlyError && e.message) {
                message.channel.send(e.message);
            } else {
                console.error(e);
                message.channel.send("An error occurred");
            }
        });
    }

    private static resolveCommandName(message: Message) {
        const [prefixedCommandName] = message.content.split(" ");
        const commandName = prefixedCommandName.slice(config.prefix.length);
        return config.caseSensitive ? commandName : commandName.toLowerCase();
    }

    private static unknownCommandMessage = (
        channel: SendableChannels,
        commandName: string,
    ): void => {
        tmpSend(channel, `Unknown command \`${commandName}\``, 4000);
    };
}
