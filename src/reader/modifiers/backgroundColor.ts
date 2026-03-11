import { FigmaContext } from "../context";
import { Color, View } from "../../types/views";
import { BackgroundModifier } from "../../types/modifiers";
import { trace } from "../tracer";
import { resolveFillStyleName } from "./fillStyleResolver";

export function appendBackgroundColor(
  context: FigmaContext,
  view: View,
  node: MinimalFillsMixin & SceneNode
) {
  trace("#appendBackgroundColor", context, node);

  const styleName = resolveFillStyleName(node);

  if (node.fills !== figma.mixed) {
    for (const fill of node.fills) {
      if (fill.type === "SOLID") {
        const { color, opacity } = fill;
        const colorView: Color = {
          type: "Color",
          red: color.r,
          green: color.g,
          blue: color.b,
          opacity: opacity,
          styleName: styleName,
        };
        const background: BackgroundModifier = {
          type: "background",
          view: colorView,
        };
        view.modifiers.push(background);
      } else {
        // TODO:
      }
    }
  }
}
