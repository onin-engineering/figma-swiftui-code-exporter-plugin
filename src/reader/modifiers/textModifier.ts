import { FigmaContext } from "../context";
import { Text, TextField } from "../../types/views";
import {
  FontTextModifier,
  FontWeightTextModifier,
  NamedFontWeight,
} from "../../types/textModifier";

const figmaToSwiftUIFontStyle: { [key: string]: string } = {
  "large title": "largeTitle",
  "largetitle": "largeTitle",
  "title": "title",
  "title1": "title",
  "title 1": "title",
  "title2": "title2",
  "title 2": "title2",
  "title3": "title3",
  "title 3": "title3",
  "headline": "headline",
  "subheadline": "subheadline",
  "body": "body",
  "callout": "callout",
  "footnote": "footnote",
  "caption": "caption",
  "caption1": "caption",
  "caption 1": "caption",
  "caption2": "caption2",
  "caption 2": "caption2",
};

interface FontStyleResult {
  namedStyle: string;
  weight?: NamedFontWeight;
  bold?: boolean;
  italic?: boolean;
}

const styleWeightMap: { [key: string]: NamedFontWeight } = {
  thin: "ultraLight",
  extralight: "thin",
  light: "light",
  regular: "regular",
  medium: "medium",
  semibold: "semibold",
  bold: "bold",
  extrabold: "heavy",
  heavy: "heavy",
  black: "black",
};

function parseVariant(variant: string): {
  weight?: NamedFontWeight;
  bold?: boolean;
  italic?: boolean;
} {
  const lower = variant.toLowerCase().trim();

  // Apple style variants: "Regular", "Emphasized", "Italic", "Emphasized Italic"
  const isItalic = lower.includes("italic");
  const isEmphasized = lower.includes("emphasized");

  if (isEmphasized || isItalic) {
    return {
      bold: isEmphasized || undefined,
      italic: isItalic || undefined,
    };
  }

  // Fall back to weight mapping (e.g. "Bold", "Semibold", "Light")
  const weight = styleWeightMap[lower];
  if (weight) return { weight };

  return {};
}

function mapToSwiftUIFontStyle(
  styleName: string
): FontStyleResult | undefined {
  const normalized = styleName.toLowerCase().trim();
  const segments = normalized.split("/").map((s) => s.trim());

  // Try exact match first (single-segment name like "Headline")
  const exact = figmaToSwiftUIFontStyle[normalized];
  if (exact) return { namedStyle: exact };

  // Try first segment (e.g. "Headline/Regular" → "headline")
  const fontStyle = figmaToSwiftUIFontStyle[segments[0]];
  if (!fontStyle) return undefined;

  // Parse variant from second segment if present
  const variant = segments.length > 1 ? parseVariant(segments[1]) : {};
  return { namedStyle: fontStyle, ...variant };
}

export function appendTextModifier(
  _context: FigmaContext,
  node: TextNode,
  text: Text | TextField
) {
  if (node.textDecoration === "UNDERLINE") {
    text.modifiers.push({ type: "underline" });
  } else if (node.textDecoration === "STRIKETHROUGH") {
    text.modifiers.push({ type: "strikethrough" });
  }

  // Check for Figma text style first
  let unmappedStyleName: string | undefined;
  if (node.textStyleId && node.textStyleId !== figma.mixed) {
    const style = figma.getStyleById(node.textStyleId as string);
    if (style) {
      const mapped = mapToSwiftUIFontStyle(style.name);
      if (mapped) {
        if (mapped.weight != null) {
          const weightModifier: FontWeightTextModifier = {
            type: "fontWeight",
            fontWeight: mapped.weight,
          };
          text.modifiers.push(weightModifier);
        }
        const modifier: FontTextModifier = {
          type: "font",
          namedStyle: mapped.namedStyle,
        };
        text.modifiers.push(modifier);
        if (mapped.bold) {
          text.modifiers.push({ type: "bold" } as const);
        }
        if (mapped.italic) {
          text.modifiers.push({ type: "italic" } as const);
        }
        return;
      }
      // Style exists but doesn't map to a system font — pass name as comment
      unmappedStyleName = style.name;
    }
  }

  // NOTE: Only supports single font member on Text
  if (node.fontName !== figma.mixed && node.fontSize !== figma.mixed) {
    const fontWeight = mappedFontWeight(node.fontName);
    if (fontWeight != null) {
      const modifier: FontWeightTextModifier = {
        type: "fontWeight",
        fontWeight: fontWeight,
      };
      text.modifiers.push(modifier);
    }

    // Apple Standard Font: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
    const appleFonts = [
      "San Francisco",
      "SF Pro",
      "SF Pro Rounded",
      "SF Mono",
      "SF Compact",
      "SF Compact Rounded",
    ];
    const { family } = node.fontName;
    if (appleFonts.includes(family)) {
      const modifier: FontTextModifier = {
        type: "font",
        system: "system",
        size: node.fontSize,
        styleComment: unmappedStyleName,
      };
      text.modifiers.push(modifier);
    } else {
      const modifier: FontTextModifier = {
        type: "font",
        family: family,
        size: node.fontSize,
        styleComment: unmappedStyleName,
      };
      text.modifiers.push(modifier);
    }
  }
}

/**
 Reference: https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/typography/
 
 Swift Interface
 @frozen public struct Weight : Hashable {
    public static let ultraLight: Font.Weight
    public static let thin: Font.Weight
    public static let light: Font.Weight
    public static let regular: Font.Weight
    public static let medium: Font.Weight
    public static let semibold: Font.Weight
    public static let bold: Font.Weight
    public static let heavy: Font.Weight
    public static let black: Font.Weight
 }
*/

function mappedFontWeight(fontName: FontName): NamedFontWeight | null {
  const mapOfFigmaAndSwiftUIFontWeight: { [key: string]: NamedFontWeight } = {
    thin: "ultraLight",
    extralight: "thin",
    light: "light",
    regular: "regular",
    medium: "medium",
    semibold: "semibold",
    bold: "bold",
    extrabold: "heavy",
    heavy: "heavy",
    black: "black",
  };
  return mapOfFigmaAndSwiftUIFontWeight[fontName.style];
}
