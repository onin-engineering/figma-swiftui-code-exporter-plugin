import { Color } from "./views";

export type SwiftUITextModifier =
  | UnderlineTextModifier
  | StrikethroughTextModifier
  | BoldTextModifier
  | ItalicTextModifier
  | FontWeightTextModifier
  | FontTextModifier
  | ForegorundTextModifier;

const textModifierTypes = [
  "underline",
  "strikethrough",
  "bold",
  "italic",
  "fontWeight",
  "font",
  "foregroundColor",
] as const;
export function isSwiftUITextModifier(args: {
  type: string;
}): args is SwiftUITextModifier {
  return (textModifierTypes as Readonly<string[]>).includes(args.type);
}

export interface TextModifier {
  readonly type: typeof textModifierTypes[number];
}

export interface UnderlineTextModifier extends TextModifier {
  readonly type: "underline";
}

export interface StrikethroughTextModifier extends TextModifier {
  readonly type: "strikethrough";
}

export interface BoldTextModifier extends TextModifier {
  readonly type: "bold";
}

export interface ItalicTextModifier extends TextModifier {
  readonly type: "italic";
}

export type NamedFontWeight =
  | "ultraLight"
  | "thin"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "heavy"
  | "heavy"
  | "black";
export interface FontWeightTextModifier extends TextModifier {
  readonly type: "fontWeight";

  fontWeight: NamedFontWeight;
}

export interface FontTextModifier extends TextModifier {
  readonly type: "font";

  namedStyle?: string;
  styleComment?: string;
  system?: "system";
  family?: string;
  size?: number;
}

export interface ForegorundTextModifier extends TextModifier {
  readonly type: "foregroundColor";

  color: Color;
}
