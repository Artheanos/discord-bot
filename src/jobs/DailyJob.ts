import { BaseJob } from "jobs/BaseJob";

export class DailyJob extends BaseJob {
    async execute(): Promise<unknown> {
        // nothing
        return;
    }
}
