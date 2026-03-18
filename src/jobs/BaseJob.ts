import { Client } from "discord.js";

export abstract class BaseJob {
    constructor(protected client: Client) {
    }

    abstract execute(): Promise<unknown>
}
