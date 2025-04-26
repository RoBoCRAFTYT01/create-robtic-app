#!/usr/bin/env bun

/**
 * Copyright (c) 2025, RobTic, RoBo.
 * Licensed under the MIT License. See LICENSE file in the project root.
 *
 * WARNING: DO NOT MODIFY THIS FILE
 * This script initializes a RobTic app and forwards commands to the local version.
 * Only modify to add warnings or troubleshooting info for create-robtic-app.
 * Ensure compatibility with Node 10+ and avoid breaking changes.
 */

const { Command } = require('commander');
const chalk = require('chalk');
const { execSync } = require('child_process');
const { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const validateProjectName = require('validate-npm-package-name');
const packageJson = require('./package.json');

const program = new Command()

const SUPPORTED_PACKAGE_MANAGERS = ['bun', 'yarn', 'npm', 'pnpm'];
const DEPENDENCIES = ['robtic-discord-startup', 'create-robtic-app', 'discord.js'];

/**
 * Determines the package manager based on user agent
 * @returns {string} Package manager name
 */
function detectPackageManager() {
    const userAgent = process.env.npm_config_user_agent || '';
    const manager = SUPPORTED_PACKAGE_MANAGERS.find(pm => userAgent.startsWith(pm));

    if (!manager) {
        console.error(chalk.red('❌ Could not detect supported package manager.'));
        console.log(chalk.gray(`User agent: ${userAgent}`));
        process.exit(1);
    }

    return manager;
}

/**
 * Generates package manager-specific commands
 * @param {string} pm - Package manager name
 * @returns {Object} Install and dev install commands
 */
function getPackageManagerCommands(pm) {
    const commands = {
        bun: { install: 'bun add', devInstall: 'bun add -d' },
        yarn: { install: 'yarn add', devInstall: 'yarn add -D' },
        npm: { install: 'npm i', devInstall: 'npm i --save-dev' },
        pnpm: { install: 'pnpm install', devInstall: 'pnpm install --save-dev' }
    };

    return commands[pm];
}

/**
 * Generates scripts for package.json
 * @param {string} template - Project template (js/ts)
 * @param {string} pm - Package manager
 * @returns {Object} Filtered scripts object
 */
function generateScripts(template, pm) {
    const isTs = template === 'ts';
    const runner = pm === 'npm' || pm === 'pnpm' ? 'node' : pm;
    const scripts = {
        start: `${isTs && pm !== 'bun' ? 'tsc && ' : ''}${runner} run src/index.${template}`,
        ...(isTs && { build: 'tsc' }),
        test: `${isTs && pm !== 'bun' ? 'tsc && ' : ''}${runner} run src/index.${template}`
    };

    return Object.fromEntries(Object.entries(scripts).filter(([_, v]) => v));
}

/**
 * Validates project name
 * @param {string} appName - Project name
 */
function validateAppName(appName) {
    const validation = validateProjectName(appName);
    if (!validation.validForNewPackages) {
        console.error(chalk.red(`Cannot create project named ${chalk.blueBright(`"${appName}"`)}`));
        [...(validation.errors || []), ...(validation.warnings || [])].forEach(error => {
            console.error(chalk.red(`  * ${error}`));
        });
        process.exit(1);
    }

    if (DEPENDENCIES.includes(appName)) {
        console.error(
            chalk.red(`Cannot create project named ${chalk.blueBright(`"${appName}"`)} due to dependency conflict.\n`) +
            chalk.blue(DEPENDENCIES.map(dep => `  ${dep}`).join('\n')) +
            chalk.red('\n\nPlease choose a different project name.')
        );
        process.exit(1);
    }
}

/**
 * Resolves project path
 * @param {string} appName - Project name
 * @returns {string} Project path
 */
function resolveProjectPath(appName) {
    return appName === '.' ? process.cwd() : join(process.cwd(), appName);
}

/**
 * Sets up project directory
 * @param {string} appName - Project name
 * @param {string} projectPath - Project path
 */
function setupProjectDirectory(appName, projectPath) {
    const folderName = appName === '.' ? projectPath.split(/[\\/]/).pop() : appName;
    validateAppName(folderName);

    if (appName !== '.') {
        if (existsSync(projectPath)) {
            console.error(chalk.red(`❌ Folder "${appName}" already exists.`));
            process.exit(1);
        }
        mkdirSync(projectPath);
        console.log(chalk.green(`✅ Created folder: ${appName}`));
    } else {
        console.log(chalk.yellow(`⚡ Using current directory: ${folderName}`));
    }
}

/**
 * Validates template existence
 * @param {string} template - Template type
 * @param {string} templatePath - Template path
 */
function validateTemplate(template, templatePath) {
    if (!existsSync(templatePath)) {
        console.error(chalk.red(`[RobTic] Template "${template}" not found at ${templatePath}.`));
        process.exit(1);
    }
}

/**
 * Installs dependencies
 * @param {string} template - Project template
 * @param {Object} commands - Package manager commands
 */
function installDependencies(template, { install, devInstall }) {
    try {
        execSync(`${install} robtic-discord-startup discord.js`, { stdio: 'inherit' });
    } catch (error) {
        console.error(chalk.red(`[RobTic] Failed to install dependencies: ${error.message}`));
        console.log(chalk.cyan('Retrying with --force...'));
        execSync(`${install} robtic-discord-startup discord.js --force`, { stdio: 'inherit' });
    }

    if (template === 'ts') {
        const devDeps = SUPPORTED_PACKAGE_MANAGERS.includes('bun') ? 'typescript @types/node' : 'typescript @types/node tsx';
        execSync(`${devInstall} ${devDeps}`, { stdio: 'inherit' });
    }
}

/**
 * Initializes the CLI program
 */
function init() {
    program
        .name(packageJson.name)
        .version(packageJson.version)
        .description(packageJson.description)
        .argument('<project-name>', 'Name of the project directory')
        .option('-t, --template <type>', 'Select project type', 'js')
        .allowUnknownOption()
        .action((projectName, options) => {
            const packageManager = detectPackageManager();
            const { install, devInstall } = getPackageManagerCommands(packageManager);
            const projectPath = resolveProjectPath(projectName);
            const folderName = projectName === '.' ? projectPath.split(/[\\/]/).pop() : projectName;
            const templatePath = join(__dirname, 'templates', options.template);
            const pkgJsonPath = join(projectPath, 'package.json');

            setupProjectDirectory(projectName, projectPath);
            validateTemplate(options.template, templatePath);

            console.log(chalk.blueBright(`[RobTic] Creating ${folderName} with ${options.template} template using ${packageManager}...`));

            try {
                cpSync(templatePath, projectPath, { recursive: true });
                const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));

                pkgJson.name = folderName;
                pkgJson.scripts = generateScripts(options.template, packageManager);
                if (packageManager !== 'bun' && options.template === 'ts') {
                    pkgJson.devDependencies = { ...pkgJson.devDependencies, tsx: '^4.19.1' };
                }

                writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
                process.chdir(projectPath);

                console.log(chalk.blueBright(`[RobTic] Installing dependencies with ${packageManager}...`));
                installDependencies(options.template, { install, devInstall });

                console.log(chalk.greenBright(`[RobTic] Done! Run your bot and enjoy! 🚀`));
                console.log(chalk.cyan(`  cd ${folderName}`));
                console.log(chalk.cyan(`  ${packageManager} run start`));
            } catch (error) {
                console.error(chalk.red(`[RobTic] Failed to create project: ${error.message}`));
                process.exit(1);
            }
        });

    program.parse(process.argv);
}

module.exports = { init };