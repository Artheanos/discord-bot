import { Message } from "discord.js"

import { BaseCommand } from "./BaseCommand"
import { choice } from "utils/random"
import { findImages } from "lib/rule34"
import { reactMultiple, awaitEmojiReaction } from "utils/discord"

export class Rule34Command extends BaseCommand {
    static description = "Search for pp on https://api.rule34.xxx/"
    static minArgsLength = 1

    static EMOJI_DELETE = "❌"
    static EMOJI_NEXT = "⏭️"

    async action(): Promise<string | void> {
        const images: string[] = await findImages(this.args.join(" "))
        const resultImage = choice(images)
        if (!resultImage) return "Not found"

        const appResponse = await this.reply(resultImage)
        this.handleReactions(appResponse)
    }

    private async handleReactions(message: Message): Promise<void> {
        switch (await this.awaitUserReactionAndAppReacting(message)) {
        case Rule34Command.EMOJI_NEXT:
            message.reactions.removeAll()
            const nextAction = await this.action()
            if (nextAction) this.reply(nextAction)
            break
        case Rule34Command.EMOJI_DELETE:
            message.delete()
            break
        }
    }

    async awaitUserReactionAndAppReacting(message: Message): Promise<unknown> {
        const appReacting = reactMultiple(message, [Rule34Command.EMOJI_NEXT, Rule34Command.EMOJI_DELETE])
        const userReaction = await awaitEmojiReaction(message, this.message.author.id)
        await appReacting
        return userReaction
    }
}
