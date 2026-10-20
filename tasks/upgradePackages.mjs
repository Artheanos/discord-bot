import * as childProcess from "child_process";
import * as fs from "fs/promises";

const packageJson = JSON.parse(await fs.readFile("./package.json"));

childProcess.execFileSync("npm", [
  "install",
  ...Object.keys(packageJson.dependencies),
]);
childProcess.execFileSync("npm", [
  "install",
  "-D",
  ...Object.keys(packageJson.devDependencies),
]);
