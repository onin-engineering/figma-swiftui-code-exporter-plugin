import { run } from "./run";

figma.showUI(__html__, { width: 480, height: 480 });

function generate() {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.ui.postMessage({ code: "" });
    return;
  }
  try {
    const code = run(selection[0]);
    figma.ui.postMessage({ code });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    figma.ui.postMessage({ code: `// Error: ${message}` });
  }
}

generate();

figma.on("selectionchange", () => {
  generate();
});
