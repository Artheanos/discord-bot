import { Client, Guild, TextChannel } from "discord.js"

import config from "config"
import { awaitIfPromise } from "utils/async"
import { BaseValidator } from "validators/BaseValidator"
import { GuildExtensionsManager } from "lib/guildStorage"
import { TextChannelMessage } from "interfaces/TextChannelMessage"
import { UserScope } from "UserScope"

export abstract class BaseCommand {
    async perform() {
        const validationResult = this.validate()

        if (typeof validationResult === "string") {
            this.reply(validationResult)
            return
        }
        if (validationResult !== undefined) {
            return
        }

        const actionResult = await awaitIfPromise(this.action())

        if (actionResult) {
            this.reply(actionResult)
        }
    }

    public static description: string
    protected static minArgsLength?: number
    protected static blacklist?: UserScope
    protected static whitelist?: UserScope
    protected static validator?: Type<BaseValidator>
    protected static ownerOnly = false

    public message: TextChannelMessage
    public channel: TextChannel
    public guild: Guild
    public args: string[]

    constructor(message: TextChannelMessage, protected client: Client) {
        this.message = message
        this.args = message.content.split(" ").slice(1)
        this.channel = message.channel
        this.guild = message.guild
    }

    protected abstract action(): string | void | Promise<string | void>

    protected reply(content: string) {
        return this.message.channel.send(content)
    }

    protected validate(): string | undefined {
        const { minArgsLength, blacklist, whitelist, ownerOnly, validator } = this.klass

        if (minArgsLength && this.args.length < minArgsLength) {
            return "Wrong number of args"
        }
        if (blacklist?.includes(this.message)) {
            return "You are in the blacklist"
        }
        if (whitelist?.includes(this.message)) {
            return "You are not in the whitelist"
        }
        if (ownerOnly && this.message.author.id !== config.ownerId) {
            return "Owner only"
        }
        if (validator) {
            const validatorResult = new validator(this).call()
            if (validatorResult) return validatorResult
        }
    }

    protected getGuildExtension() {
        return GuildExtensionsManager.getGuildExtension(this.guild.id)
    }

    private get klass() {
        return this.constructor as typeof BaseCommand
    }
}
