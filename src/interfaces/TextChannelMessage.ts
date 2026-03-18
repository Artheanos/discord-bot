import { Guild, Message, TextChannel } from "discord.js"

export interface TextChannelMessage extends Message<true> {
  channel: TextChannel
  guild: Guild
}
