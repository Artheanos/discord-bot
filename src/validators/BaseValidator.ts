import { BaseCommand } from "commands/BaseCommand";

export abstract class BaseValidator {
    constructor(protected command: BaseCommand) {
    }

    public abstract call(): string | undefined
}