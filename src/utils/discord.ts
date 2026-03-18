import { Message, SendableChannels } from "discord.js";

export async function tmpSend(channel: SendableChannels, messageContent: string, deleteAfter: number) {
    const msg = await channel.send(messageContent);
    setTimeout(() => msg.delete(), deleteAfter);
    return msg;
}

export async function reactMultiple(message: Message, emojis: string[]): Promise<unknown> {
    const reactions = emojis.map(emoji => message.react(emoji));
    return Promise.all(reactions);
}

export async function awaitEmojiReaction(message: Message, userId: string) {
    const reactions = await message.awaitReactions({
        filter: (_, user) => user.id === userId,
        max: 1,
        time: 30_000,
    });
    return reactions.first()?.emoji.name;
}
