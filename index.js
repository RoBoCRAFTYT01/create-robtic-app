#!/usr/bin/env node
import { execSync } from "child_process";
import { existsSync, cpSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const projectName = process.argv[2] || "my-app";
const template = process.argv.includes("--template=typescript") ? "ts" : "js";

if (existsSync(projectName)) {
    console.error("❌ Folder already exists");
    process.exit(1);
}

console.log(`📦 Creating ${projectName} with ${template} template...`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

cpSync(join(__dirname, "template", template), projectName, { recursive: true });

process.chdir(projectName);
execSync("bun add robtic-discord-startup discord.js", { stdio: "inherit" });

console.log("✅ Done! Run your bot and enjoy! 🚀");
