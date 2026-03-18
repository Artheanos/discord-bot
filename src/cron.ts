import * as cron from "node-cron";
import { DailyJob } from "jobs/DailyJob";
import { client } from "initializers/client";

cron.schedule("20 10 * * 1-5", () => {
    new DailyJob(client).execute().then(() => console.log("Done Job"));
});
