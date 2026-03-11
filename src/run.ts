import { BuildContext, BuildContextOption } from "./builder/context";
import { build } from "./builder/entrypoint";
import { FigmaContext } from "./reader/context";
import { traverse } from "./reader/entrypoint";
import { assert } from "./util/foundation";

export const run = (root: SceneNode, option?: BuildContextOption): string => {
  const figmaContext = new FigmaContext();
  const body = findBody(root);
  if (body != null) {
    traverse(figmaContext, body);
  } else {
    traverse(figmaContext, root);
  }
  assert(figmaContext.root != null, "it is necessary root");

  const buildContext = new BuildContext();
  buildContext.option = option;

  // For component variants (e.g. "State=Active, Size=Large"), use the
  // parent component set name which is the actual component name.
  let rootName = root.name;
  if (rootName.includes("=") && root.parent && "name" in root.parent) {
    rootName = (root.parent as SceneNode).name;
  }
  buildContext.rootNodeName = rootName;
  buildContext.current = figmaContext.root;
  build(buildContext);

  if (figmaContext.allAppViewReferences.length > 0) {
    buildContext.lineBreak();
    figmaContext.allAppViewReferences.forEach((e) => {
      if (e.node?.id !== root.id) {
        buildContext.current = e;
        build(buildContext);
        buildContext.lineBreak();
      }
    });
  }

  let output = option?.isGenerateOnlyView ? "" : "import SwiftUI\nimport PlaygroundSupport\n\n";

  if (buildContext.textStrings.size > 0) {
    output += "// MARK: - Localizable Strings\n";
    output += "// Key → Default Value\n";
    const entries = Array.from(buildContext.textStrings.entries());
    entries.forEach(([key, value]) => {
      output += `// "${key}" → "${value}"\n`;
    });
    output += "\n";
  }

  output += buildContext.code;

  if (buildContext.structName) {
    output += "\n";
    output += `PlaygroundPage.current.setLiveView(${buildContext.structName}())\n`;
  }

  return output;
};

export const testRun = (root: SceneNode): string => {
  return run(root, {
    isGenerateOnlyView: true,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isContainerType(node: any): node is ChildrenMixin {
  return (node as ChildrenMixin).children !== undefined;
}

function findBody(node: SceneNode): SceneNode | null {
  if (node.name === "Export::Body") {
    return node;
  }
  if (isContainerType(node)) {
    for (const chlid of node.children) {
      const value = findBody(chlid);
      if (value != null) {
        return value;
      }
    }
  }
  return null;
}
