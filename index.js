#!/usr/bin/env node
const chalk = require("chalk");
const { execSync } = require("child_process");
const { existsSync, cpSync, readdirSync } = require("fs");
const { join, resolve } = require("path");

const projectName = process.argv[2] || "my-app";
const template = process.argv.includes("--template=typescript") ? "ts" : "js";

// Validate project name
if (!projectName.match(/^[a-zA-Z0-9-_]+$/)) {
    console.error(chalk.red("❌ Project name can only contain letters, numbers, hyphens, or underscores."));
    process.exit(1);
}

// Check if folder exists
if (existsSync(projectName)) {
    console.error(chalk.red(`❌ Folder "${projectName}" already exists.`));
    process.exit(1);
}

// Validate template directory
const templatePath = join(__dirname, "templates", template);
if (!existsSync(templatePath)) {
    console.error(chalk.red(`❌ Template "${template}" not found at ${templatePath}.`));
    process.exit(1);
}

console.log(chalk.blueBright(`[RobTic] Creating ${projectName} with ${template} template...`));

// Function to detect available package manager
function getPackageManager() {
    try {
        execSync("bun --version", { stdio: "ignore" });
        return "bun";
    } catch {
        try {
            execSync("npm --version", { stdio: "ignore" });
            return "npm";
        } catch {
            try {
                execSync("yarn --version", { stdio: "ignore" });
                return "yarn";
            } catch {
                return null;
            }
        }
    }
}

try {
    // Copy template files
    cpSync(templatePath, projectName, { recursive: true });
    console.log(chalk.blueBright(`[RobTic] Copied ${template} template to ${projectName}`));

    // Change to project directory
    process.chdir(projectName);

    // Install dependencies
    const pkgManager = getPackageManager();
    if (!pkgManager) {
        console.error(chalk.red("❌ No supported package manager (bun, npm, or yarn) found."));
        process.exit(1);
    }

    console.log(chalk.blueBright(`[RobTic] Installing dependencies with ${pkgManager}...`));
    const installCmd = pkgManager === "bun" ? "bun add" : pkgManager === "yarn" ? "yarn add" : "npm install";
    
    execSync(`${installCmd} robtic-discord-startup discord.js ${template === "ts" ? `ts-node` : ""} `, { stdio: "inherit" });

    console.log(chalk.greenBright(`[RobTic] Done! Run your bot and enjoy! 🚀`));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  ${pkgManager} run start`));
} catch (err) {
    console.error(chalk.red(`[RobTic] Failed to create project: ${err.message}`));
    process.exit(1);
}