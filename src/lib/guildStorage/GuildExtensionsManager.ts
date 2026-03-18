import { GuildExtension } from "./GuildExtension";

export class GuildExtensionsManager {
    static guilds: Record<string, GuildExtension> = {};

    static getGuildExtension(guildId: string) {
        if (!(guildId in this.guilds)) {
            this.assignNewGuildExtension(guildId);
        }

        return this.guilds[guildId];
    }

    private static assignNewGuildExtension(guildId: string) {
        this.guilds[guildId] = new GuildExtension(guildId);
    }
}
