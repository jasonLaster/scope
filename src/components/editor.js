import React from "react";
import "babylon";

import { scopeChain } from "../utils/scopes";

const CodeMirror = require("codemirror");
require("codemirror/lib/codemirror.css");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/htmlmixed/htmlmixed");
require("codemirror/mode/coffeescript/coffeescript");
require("codemirror/mode/jsx/jsx");
require("codemirror/mode/elm/elm");
require("codemirror/mode/clojure/clojure");
require("codemirror/addon/search/searchcursor");
require("codemirror/addon/fold/foldcode");
require("codemirror/addon/fold/brace-fold");
require("codemirror/addon/fold/indent-fold");
require("codemirror/addon/fold/foldgutter");
require("codemirror/addon/selection/active-line");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/mode/clike/clike");
require("codemirror/mode/rust/rust");

import "./editor.css";

window.CodeMirror = CodeMirror;

function renderBinding(name, value) {
  const onClick = () => console.log(value);
  return (
    <div key={name} onClick={onClick}>
      {name}
    </div>
  );
}

function renderScope(scope) {
  const { block, bindings } = scope;
  const location = `line ${block.loc.start.line}`;
  return (
    <div className="scope" key={scope.uid}>
      <div className="header">
        <div className="type">{block.type}</div>
        <div className="location"> {location}</div>
      </div>
      <div className="bindings">
        {Object.keys(bindings).map(key => renderBinding(key, bindings[key]))}
      </div>
    </div>
  );
}

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { source, lineOffsets } = this.props;

    let text = source.text;
    if (lineOffsets) {
      const { startLocation, endLocation } = lineOffsets;
      text = source.text
        .split("\n")
        .slice(startLocation.line, endLocation.line)
        .join("\n");
    }

    this.editor = CodeMirror(this.$editor, {
      value: text,
      mode: "javascript",
      lineNumbers: true,
      firstLineNumber: lineOffsets ? lineOffsets.startLocation.line : 1
    });

    const wrapper = this.editor.getWrapperElement();
    wrapper.addEventListener("click", e => this.onClick(e));
  }

  onClick(event) {
    const { source, lineOffsets } = this.props;
    let line = this.editor.lineAtHeight(event.clientY) + 1;
    if (lineOffsets) {
      line = line + lineOffsets.startLocation.line;
    }
    const scopes = scopeChain(source, { line, column: 0 });
    this.setState({ scopes });
  }

  renderScopes() {
    const { scopes } = this.state;
    if (!scopes) return null;

    return (
      <div className="scopes">{scopes.map(scope => renderScope(scope))}</div>
    );
  }

  render() {
    const { source, type } = this.props;
    return (
      <div className={`${type}`}>
        <div
          className={`editor`}
          ref={editor => {
            this.$editor = editor;
          }}
        />
        {this.renderScopes()}
      </div>
    );
  }
}
