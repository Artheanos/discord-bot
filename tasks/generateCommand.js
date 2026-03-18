const fs = require("fs");
const path = require("path");
const { capitalize } = require("../src/utils/strings");

const template = (name) =>
    `import { BaseCommand } from "./BaseCommand"

export class ${name}Command extends BaseCommand {
  static description = '${name} command'

  action() {
    return 'Hello world'
  }
}
`;

const commandsPath = path.join(__dirname, "../src/commands");

const name = capitalize(process.argv[2]);
const newCommandPath = path.join(commandsPath, `${name}Command.ts`);
fs.appendFileSync(newCommandPath, template(name));
