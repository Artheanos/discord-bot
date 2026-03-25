import { DMChannel, Message, TextChannel } from "discord.js";

export interface TextBasedMessage<
    Guild extends boolean = boolean,
> extends Message<Guild> {
    channel: Guild extends true ? TextChannel : DMChannel;
}

export type GuildMessage = TextBasedMessage<true>;
