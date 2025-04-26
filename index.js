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
// The only reason to modify this file is to add more warnings and
// troubleshooting information for the `create-robtic-app` command.
//
// Do not make breaking changes! We absolutely don't want to have to
// tell people to update their global version of create-robtic-app.
//
// Also be careful with new language features.
// This file must work on Node 10+.
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   /!\ DO NOT MODIFY THIS FILE /!\
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const { init } = require("./createRobticApp");

init();