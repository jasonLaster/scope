/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fs = require("fs");
const path = require("path");

const toolbox = require("devtools-launchpad/index");
const express = require("express");

const envConfig = {
  development: {
    serverPort: 8003
  },

  "firefox": {
    "webSocketConnection": false,
    "host": "localhost",
    "webSocketPort": 8116,
    "tcpPort": 6080,
    "mcPath": "./firefox"
  },

};

const webpackConfig = toolbox.toolboxConfig(
  {
    entry: {
      bundle: path.join(__dirname, "../src/index.js")
    },

    output: {
      path: path.join(__dirname, "assets/build"),
      filename: "[name].js",
      publicPath: "/assets/build"
    }
  },
  envConfig
);

// console.log(webpackConfig);
let { app } = toolbox.startDevServer(envConfig, webpackConfig, __dirname);

app.use("/scopes", express.static("src"));

console.log(
  `>> GO TO http://localhost:${envConfig.development.serverPort}/`
);
