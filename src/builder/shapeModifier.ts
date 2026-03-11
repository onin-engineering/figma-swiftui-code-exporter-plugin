import { SwiftUIViewShapeModifier } from "../types/shapeModifier";
import { mapSwiftUIColor } from "../util/mapper";
import { BuildContext } from "./context";
import { trace } from "./tracer";

export function buildShapeModifier(
  context: BuildContext,
  modifier: SwiftUIViewShapeModifier
) {
  trace("#buildShapeModifier", context, modifier);
  if (modifier.type === "stroke") {
    const color = mapSwiftUIColor(modifier.color);
    const comment = color.comment ? ` // ${color.comment}` : "";
    context.add(
      `.stroke(${color.expression}, lineWidth: ${
        modifier.lineWidth
      })${comment}`
    );
  }
}
