import * as babylon from "babylon";
import traverse from "babel-traverse";

function getAst(source) {
  return babylon.parse(source.text, {
    sourceType: "module",
    plugins: [
      "jsx",
      "flow",
      "doExpressions",
      "objectRestSpread",
      "classProperties",
      "exportExtensions",
      "asyncGenerators",
      "functionBind",
      "functionSent",
      "dynamicImport",
      "templateInvalidEscapes"
    ]
  });
}

export function traverseAst(source: Source, visitor: Visitor) {
  const ast = getAst(source);
  traverse(ast, visitor);
  return ast;
}
