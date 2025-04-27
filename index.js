#!/usr/bin/env bun

/**
 * Copyright (c) 2025, RobTic,  RoBo.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
// The only job of create-robtic-app is to init the repository and then
// forward all the commands to the local version of create-robtic-app.
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Required minimum Node.js version
const MIN_NODE_VERSION = '14.0.0';

const compareVersion = (v1, v2) => {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        if ((v1Parts[i] || 0) < (v2Parts[i] || 0)) {
            return -1;
        } else if ((v1Parts[i] || 0) > (v2Parts[i] || 0)) {
            return 1;
        }
    }
    return 0;
};

const currentNodeVersion = process.version.slice(1);

if (compareVersion(currentNodeVersion, MIN_NODE_VERSION) < 0) {
    console.error(`
    ${chalk.red('⚠️ ERROR:')}
        Your current Node.js version is ${currentNodeVersion}.
        Please upgrade your Node.js to version ${MIN_NODE_VERSION} or higher to run create-robtic-app.
    `);
    process.exit(1);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   Now, continue with the rest of the program
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const { init } = require("./createRobticApp");

init();
