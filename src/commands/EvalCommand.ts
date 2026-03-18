import { BaseCommand } from "./BaseCommand";

export class EvalCommand extends BaseCommand {
    static description = "Evaluate javascript";
    static ownerOnly = true;

    action() {
        const evalResult = eval(this.args.join(" "));
        evalResult && this.reply(JSON.stringify(evalResult));
    }
}
