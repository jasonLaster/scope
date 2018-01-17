import { isOriginalId, generatedToOriginalId } from "devtools-source-map";
import { getOriginalURLs } from "devtools-source-map/src/source-map";

window.data = {
  sources: [],
  connection: null
};

function createOriginalSources(urls, source) {
  return;
}

async function newSource(_, { source }) {
  const text = await data.connection.threadClient
    .source({ actor: source.actor })
    .source();

  const newSource = {
    id: source.actor,
    url: source.url,
    sourceMapURL: source.sourceMapURL,
    text: text.source
  };

  const urls = await getOriginalURLs(newSource);
  newSource.originalSources = urls.map(url => ({
    url,
    id: generatedToOriginalId(newSource.id, url)
  }));

  window.data.sources.push(newSource);

  window.render();
}

function navigate() {}

export default async function onConnect(connection) {
  const {
    tabConnection: { tabTarget, threadClient, debuggerClient }
  } = connection;

  data.connection = { threadClient };

  tabTarget.on("navigate", navigate);
  threadClient.addListener("newSource", newSource);
  threadClient.getSources();
}
