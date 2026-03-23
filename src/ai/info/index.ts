import { readFileSync } from "node:fs";
import { tools } from "./tools";
import path = require("node:path");

export default {
    systemPrompt: readFileSync(
        path.join(__dirname, "systemPrompt.md"),
        "utf-8",
    ),
    tools,
};
