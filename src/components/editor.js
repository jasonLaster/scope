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

window.CodeMirror = CodeMirror;

function renderScope(scope) {
  const { block, bindings } = scope;
  return (
    <div className="scope" key={scope.uid}>
      <div className="type">{block.type}</div>
      {Object.keys(bindings).join(", ")}
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

  onClick(e) {
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

    return <div>{scopes.map(scope => renderScope(scope))}</div>;
  }

  render() {
    const { source } = this.props;
    return (
      <div>
        <div
          className="editor"
          ref={editor => {
            this.$editor = editor;
          }}
        />
        {this.renderScopes()}
        />
      </div>
    );
  }
}
