#!/usr/bin/env node
const { default: chalk } = require("chalk");
const { execSync } = require("child_process");
const { existsSync, cpSync } = require("fs");
const { join } = require("path");

const projectName = process.argv[2] || "my-app";
const template = process.argv.includes("--template=typescript") ? "ts" : "js";

if (existsSync(projectName)) {
    console.error("❌ Folder already exists");
    process.exit(1);
}

console.log(`${chalk.blueBright["[RobTic]"]} Creating ${projectName} with ${template} template...`);


try {
    cpSync(join(__dirname, "template", template), projectName, { recursive: true });

    process.chdir(projectName);
    execSync("bun add robtic-discord-startup discord.js", { stdio: "inherit" });

    console.log(`${chalk.blueBright["[RobTic]"]} Done! Run your bot and enjoy! 🚀`);
} catch ( err ) {
    console.log(`${chalk.red["RobTic"]} can't create files or install package \n`, err);
}
