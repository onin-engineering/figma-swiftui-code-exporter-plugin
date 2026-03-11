import { SwiftUITextModifier } from "../types/textModifier";
import { mapSwiftUIColor } from "../util/mapper";
import { BuildContext } from "./context";
import { trace } from "./tracer";

export function buildTextModifier(
  context: BuildContext,
  textModifier: SwiftUITextModifier
) {
  trace("#buildTextModifier", context, textModifier);

  if (textModifier.type === "underline") {
    context.add(`.underline()`);
  } else if (textModifier.type === "strikethrough") {
    context.add(`.strikethrough()`);
  } else if (textModifier.type === "bold") {
    context.add(`.bold()`);
  } else if (textModifier.type === "italic") {
    context.add(`.italic()`);
  } else if (textModifier.type === "fontWeight") {
    context.add(`.fontWeight(.${textModifier.fontWeight})`);
  } else if (textModifier.type === "font") {
    if (textModifier.namedStyle != null) {
      context.add(`.font(.${textModifier.namedStyle})`);
    } else {
      const args: string[] = [];
      if (textModifier.size != null) {
        args.push(`size: ${textModifier.size}`);
      }
      const fontArgument = args.join(", ");
      const comment = textModifier.styleComment
        ? ` // ${textModifier.styleComment}`
        : "";
      if (textModifier.system != null) {
        context.add(
          `.font(.${textModifier.system}(${fontArgument}))${comment}`
        );
      } else if (textModifier.family != null) {
        context.add(
          `.font(.custom("${textModifier.family}", ${fontArgument}))${comment}`
        );
      }
    }
  } else if (textModifier.type === "foregroundColor") {
    const color = mapSwiftUIColor(textModifier.color);
    const comment = color.comment ? ` // ${color.comment}` : "";
    context.add(`.foregroundColor(${color.expression})${comment}`);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _: never = textModifier;
  }
}
