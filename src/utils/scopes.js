import { traverseAst } from "./ast";
import { nodeContainsPosition } from "./contains";
import * as t from "babel-types";

function isFunction(path: NodePath) {
  return (
    t.isFunction(path) ||
    t.isArrowFunctionExpression(path) ||
    t.isObjectMethod(path) ||
    t.isClassMethod(path) ||
    path.type === "MethodDefinition" ||
    (t.isClassProperty(path.parent) && t.isArrowFunctionExpression(path))
  );
}

export function getClosestScope(source, location) {
  let closestPath = null;

  traverseAst(source, {
    enter(path) {
      if (!nodeContainsPosition(path.node, location)) {
        return path.skip();
      }

      if (t.isBlockStatement(path) || isFunction(path) || t.isProgram(path)) {
        closestPath = path;
      }
    }
  });

  if (!closestPath) {
    return;
  }

  return closestPath.scope;
}

export function scopeChain(source, location) {
  let scope = getClosestScope(source, location);
  const scopes = [];
  do {
    scopes.push(scope);
    scope = scope.parent;
  } while (scope);
  console.log(scopes);
  return scopes;
}
