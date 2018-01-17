import ReactDOM from "react-dom";
import React from "react";

import {
  getOriginalSourceText,
  getGeneratedLocation
} from "devtools-source-map/src/source-map";
import Editor from "./components/editor";

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

function sourcesList(sources) {
  return sources.map(source => (
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
  ));
}

function renderSelectedSource(selectedSource) {
  if (!selectedSource) {
    return null;
  }
  const { originalSource, source, lineOffsets } = selectedSource;
  return (
    <div className="sources grid">
      <Editor source={originalSource} />
      <Editor source={source} lineOffsets={lineOffsets} />
    </div>
  );
}

window.render = function render() {
  const { sources, selectedSource } = window.data;
  ReactDOM.render(
    <div>
      {sourcesList(sources)}
      {renderSelectedSource(selectedSource)}
    </div>,
    document.getElementById("mount")
  );
};
