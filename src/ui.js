import ReactDOM from "react-dom";
import React from "react";

import {
  getOriginalSourceText,
  getGeneratedLocation
} from "devtools-source-map/src/source-map";
import Editor from "./components/Editor";
import Header from "./components/Header";

window.getGeneratedLocation = getGeneratedLocation;

async function onClickSource(originalSource, source) {
  const response = await getOriginalSourceText(originalSource);

  originalSource = { ...originalSource, ...response };

  const startLocation = await getGeneratedLocation(
    {
      sourceId: originalSource.id,
      line: 1,
      column: 0
    },
    originalSource
  );

  const lines = originalSource.text.split("\n");
  let endLocation;
  let lineOffset = 1;

  do {
    endLocation = await getGeneratedLocation(
      {
        sourceId: originalSource.id,
        line: lines.length - lineOffset++,
        column: Infinity
      },
      originalSource
    );
  } while (!endLocation.line);

  window.data.selectedSource = {
    originalSource,
    source,
    lineOffsets: {
      startLocation,
      endLocation
    }
  };
  render();
}

function select() {
  <Select
    id="state-select"
    ref={ref => {
      this.select = ref;
    }}
    onBlurResetsInput={false}
    onSelectResetsInput={false}
    autoFocus
    options={options}
    simpleValue
    clearable={this.state.clearable}
    name="selected-state"
    disabled={this.state.disabled}
    value={this.state.selectValue}
    onChange={this.updateValue}
    rtl={this.state.rtl}
    searchable={this.state.searchable}
  />;
}

function sourcesList(selectedSource, sources) {
  if (selectedSource) {
    return null;
  }

  return (
    <div>
      {sources.map(source => (
        <div className="source" key={source.id}>
          <div className="generated-url">{source.url}</div>
          {source.originalSources
            .filter(({ url }) => !url.includes("node_module"))
            .map(originalSource => (
              <div
                className="original-url"
                key={originalSource.id}
                onClick={() => onClickSource(originalSource, source)}
              >
                {originalSource.url}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

function renderSelectedSource(selectedSource) {
  if (!selectedSource) {
    return [];
  }
  const { originalSource, source, lineOffsets } = selectedSource;
  return [
    <Editor key="original" type="original" source={originalSource} />,
    <Editor
      key="generated"
      type="generated"
      source={source}
      lineOffsets={lineOffsets}
    />
  ];
}

window.render = function render() {
  const { sources, selectedSource } = window.data;
  ReactDOM.render(
    <div className="app">
      <Header />
      {sourcesList(selectedSource, sources)}
      {renderSelectedSource(selectedSource)}
    </div>,
    document.getElementById("mount")
  );
};
