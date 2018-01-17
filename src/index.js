/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// @flow

import React from "react";
import ReactDOM from "react-dom";

import { bootstrap, L10N, unmountRoot } from "devtools-launchpad";
import onConnect from "./connect";
import "./ui";
import "./index.css";

bootstrap(React, ReactDOM).then(connection => {
  onConnect(connection);
});
