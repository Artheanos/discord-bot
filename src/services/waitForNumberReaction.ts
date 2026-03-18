import { Message } from "discord.js"
import { awaitEmojiReaction, reactMultiple } from "utils/discord"

const EMOJI_NUMBERS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

const emojiToNumber = (emoji: string) => {
    return new TextEncoder().encode(emoji)[0] - 48
}

export const waitForNumberReaction = async (message: Message, userId: string) => {
    const waitUntilReactionsFinish = reactMultiple(message, EMOJI_NUMBERS)
    const emoji = await awaitEmojiReaction(message, userId)
    waitUntilReactionsFinish.then(() => message.delete())
    return emoji && emojiToNumber(emoji)
}
