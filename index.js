#!/usr/bin/env node
const chalk = require("chalk");
const { execSync } = require("child_process");
const { existsSync, cpSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const projectName = process.argv[2] || "my-app";
const template = process.argv.includes("--template=typescript") ? "ts" : "js";

// Detect package manager (bunx or npx)
function detectPackageManager() {
    if (process.argv[0].includes("bunx") || process.env.BUN_INSTALL) {
        return "bun";
    }
    return "npm";
}

const pkgManager = detectPackageManager();
const isBun = pkgManager === "bun";

// Define scripts based on package manager and template
const scripts = isBun
    ? {
        start: `bun src/index.${template}`,
        build: template === "ts" ? "tsc" : undefined,
        test: `bun src/index.${template}`,
    }
    : {
        start: template === "ts" ? "tsx src/index.ts" : "node src/index.js",
        build: template === "ts" ? "tsc" : undefined,
        test: template === "ts" ? "tsx src/index.ts" : "node src/index.js",
    };

// Remove undefined scripts
const filteredScripts = Object.fromEntries(
    Object.entries(scripts).filter(([_, value]) => value !== undefined)
);

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
console.log(templatePath)
if (!existsSync(templatePath)) {
    console.error(chalk.red(`❌ Template "${template}" not found at ${templatePath}.`));
    process.exit(1);
}

console.log(chalk.blueBright(`[RobTic] Creating ${projectName} with ${template} template using ${pkgManager}...`));

// Function to detect available package manager for installation
function getInstallPackageManager() {
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

    // Update package.json with dynamic scripts and project name
    const pkgJsonPath = join(projectName, "package.json");
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
    pkgJson.name = projectName;
    pkgJson.scripts = filteredScripts;
    if (!isBun && template === "ts") {
        pkgJson.devDependencies["tsx"] = "^4.19.1";
    }
    writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

    // Change to project directory
    process.chdir(projectName);

    // Install dependencies
    const installPkgManager = getInstallPackageManager();
    if (!installPkgManager) {
        console.error(chalk.red("❌ No supported package manager (bun, npm, or yarn) found."));
        process.exit(1);
    }

    console.log(chalk.blueBright(`[RobTic] Installing dependencies with ${installPkgManager}...`));
    const installCmd = installPkgManager === "bun" ? "bun add" : installPkgManager === "yarn" ? "yarn add" : "npm install";
    try {
        execSync(`${installCmd} robtic-discord-startup discord.js`, { stdio: "inherit" });
    } catch (installErr) {
        console.error(chalk.red(`[RobTic] Failed to install dependencies: ${installErr.message}`));
        console.log(chalk.cyan("Retrying installation with --force..."));
        execSync(`${installCmd} robtic-discord-startup discord.js --force`, { stdio: "inherit" });
    }
    if (template === "ts") {
        const devInstallCmd = installPkgManager === "bun" ? "bun add -d" : installPkgManager === "yarn" ? "yarn add --dev" : "npm install -D";
        const devDeps = isBun ? "typescript @types/node" : "typescript @types/node tsx";
        execSync(`${devInstallCmd} ${devDeps}`, { stdio: "inherit" });
    }

    console.log(chalk.greenBright(`[RobTic] Done! Run your bot and enjoy! 🚀`));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  ${installPkgManager} run start`));
} catch (err) {
    console.error(chalk.red(`[RobTic] Failed to create project: ${err.message}`));
    process.exit(1);
}