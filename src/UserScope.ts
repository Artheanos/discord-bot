import { Collection, Message, Role, Snowflake } from "discord.js";

export class UserScope {
    roleIds?: string[];
    userIds?: string[];

    constructor({
        userIds,
        roleIds,
    }: {
        userIds?: string[];
        roleIds?: string[];
    }) {
        this.userIds = userIds;
        this.roleIds = roleIds;
    }

    includes(message: Message): boolean {
        if (this.idsInclude(message.author.id)) {
            return true;
        }
        return !!(
            message.member && this.rolesInclude(message.member.roles.cache)
        );
    }

    private idsInclude(authorId: string): boolean {
        return !!this.userIds?.includes(authorId);
    }

    private rolesInclude(cache: Collection<Snowflake, Role>): boolean {
        if (this.roleIds) {
            for (const role of this.roleIds) {
                if (cache.has(role)) return true;
            }
        }
        return false;
    }
}
