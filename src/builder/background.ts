import { BackgroundModifier } from "../types/modifiers";
import { mapSwiftUIColor } from "../util/mapper";
import { BuildContext } from "./context";
import { trace } from "./tracer";

export function buildBackground(
  context: BuildContext,
  background: BackgroundModifier
) {
  trace("#buildBackground", context, background);
  if (background.view.type === "Color") {
    const mapped = mapSwiftUIColor(background.view);
    const comment = mapped.comment ? ` // ${mapped.comment}` : "";
    context.add(`.background(${mapped.expression})${comment}`);
  }
}
