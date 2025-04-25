#!/usr/bin/env node
import { execSync } from "child_process";
import { existsSync, cpSync } from "fs";
import { join } from "path";

const projectName = process.argv[2] || "my-app";
const template = process.argv.includes("--template=typescript") ? "ts" : "js";

if (existsSync(projectName)) {
    console.error("❌ Folder already exists");
    process.exit(1);
}

console.log(`📦 Creating ${projectName} with ${template} template...`);

cpSync(join(__dirname, "template", template), projectName, { recursive: true });

// go into project and install robtic
process.chdir(projectName);
execSync("bun add robtic-discord-startup discord.js", { stdio: "inherit" });

console.log("✅ Done! Run your bot and enjoy! 🚀");
