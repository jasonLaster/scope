import React from "react";
import ReactDOM from "react-dom";

import { bootstrap, L10N, unmountRoot } from "devtools-launchpad";
import onConnect from "./connect";
import App from "./components/App";
import "./index.css";

bootstrap(React, ReactDOM).then(connection => {
  onConnect(connection);
});

window.render = function render() {
  ReactDOM.render(<App />, document.getElementById("mount"));
};
