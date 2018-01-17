import React from "react";

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

export default class Editor extends React.Component {
  componentDidMount() {
    const { source, lineOffsets } = this.props;

    let text = source.text;
    if (lineOffsets) {
      const { startLocation, endLocation } = lineOffsets;
      text = source.text
        .split("\n")
        .slice(startLocation.line, startLocation.line + endLocation.line)
        .join("\n");
    }

    this.editor = CodeMirror(this.$editor, {
      value: text,
      mode: "javascript",
      lineNumbers: true,
      firstLineNumber: lineOffsets ? lineOffsets.startLocation.line : 1
    });
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
        />
      </div>
    );
  }
}
