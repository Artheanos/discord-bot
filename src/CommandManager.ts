import { Client, Message, SendableChannels } from "discord.js";

import config from "config";
import { FriendlyError } from "errors/FriendlyError";
import { routes } from "routes";
import { GuildMessage } from "interfaces/discord";
import { tmpSend } from "utils/discord";

import { HelpCommand } from "commands/HelpCommand";
import { BaseCommand } from "commands/BaseCommand";

// HelpCommand references `routes`, so it has to be added
// after the `routes` have been initialized
routes["help"] = HelpCommand;

export class CommandManager {
    constructor(private client: Client) {}

    processMessage(message: GuildMessage) {
        if (message.content.startsWith(config.prefix)) {
            const commandName = CommandManager.resolveCommandName(message);

            if (commandName in routes) {
                try {
                    this.performCommand(commandName, message);
                } catch (e) {
                    if (e instanceof FriendlyError) {
                        message.channel.send(e.toString());
                    } else {
                        const id = Math.random().toString(16).substring(2);
                        console.error(id, e);
                        message.channel.send("Unexpected error. ID: " + id);
                    }
                }
            } else {
                CommandManager.unknownCommandMessage(
                    message.channel,
                    commandName,
                );
            }
        }
    }

    private performCommand(name: string, message: GuildMessage) {
        const commandClass: Type<BaseCommand> = routes[name];
        const commandProps = [message as GuildMessage, this.client];
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
