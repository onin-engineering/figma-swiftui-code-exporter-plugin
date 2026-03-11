import { Color } from "../types/views";

// Simple color names (Color.xxx)
const swiftUISystemColors: { [key: string]: string } = {
  "red": "Color.red",
  "orange": "Color.orange",
  "yellow": "Color.yellow",
  "green": "Color.green",
  "mint": "Color.mint",
  "teal": "Color.teal",
  "cyan": "Color.cyan",
  "blue": "Color.blue",
  "indigo": "Color.indigo",
  "purple": "Color.purple",
  "pink": "Color.pink",
  "brown": "Color.brown",
  "black": "Color.black",
  "white": "Color.white",
  "gray": "Color.gray",
  "clear": "Color.clear",
  "primary": "Color.primary",
  "secondary": "Color.secondary",
};

// Apple UI Kit hierarchical style names → SwiftUI
const appleColorStyleMap: { [key: string]: string } = {
  // Colors/*
  "colors/red": "Color.red",
  "colors/orange": "Color.orange",
  "colors/yellow": "Color.yellow",
  "colors/green": "Color.green",
  "colors/mint": "Color.mint",
  "colors/teal": "Color.teal",
  "colors/cyan": "Color.cyan",
  "colors/blue": "Color.blue",
  "colors/indigo": "Color.indigo",
  "colors/purple": "Color.purple",
  "colors/pink": "Color.pink",
  "colors/brown": "Color.brown",
  // Backgrounds/*
  "backgrounds/primary": "Color(.systemBackground)",
  "backgrounds/secondary": "Color(.secondarySystemBackground)",
  "backgrounds/tertiary": "Color(.tertiarySystemBackground)",
  // Backgrounds Grouped/*
  "backgrounds grouped/primary": "Color(.systemGroupedBackground)",
  "backgrounds grouped/secondary": "Color(.secondarySystemGroupedBackground)",
  "backgrounds grouped/tertiary": "Color(.tertiarySystemGroupedBackground)",
  // Fills/*
  "fills/primary": "Color(.systemFill)",
  "fills/secondary": "Color(.secondarySystemFill)",
  "fills/tertiary": "Color(.tertiarySystemFill)",
  "fills/quaternary": "Color(.quaternarySystemFill)",
  // Grays/*
  "grays/gray": "Color.gray",
  "grays/gray 2": "Color(.systemGray2)",
  "grays/gray 3": "Color(.systemGray3)",
  "grays/gray 4": "Color(.systemGray4)",
  "grays/gray 5": "Color(.systemGray5)",
  "grays/gray 6": "Color(.systemGray6)",
  "grays/black": "Color.black",
  "grays/white": "Color.white",
  // Labels/*
  "labels/primary": "Color(.label)",
  "labels/secondary": "Color(.secondaryLabel)",
  "labels/tertiary": "Color(.tertiaryLabel)",
  "labels/quaternary": "Color(.quaternaryLabel)",
  // Separators/*
  "separators/opaque": "Color(.opaqueSeparator)",
  "separators/non-opaque": "Color(.separator)",
  // Vibrant Fills/Dark/*
  "vibrant fills/dark/vibrant primary": "Color(.systemFill)",
  "vibrant fills/dark/vibrant secondary": "Color(.secondarySystemFill)",
  "vibrant fills/dark/vibrant tertiary": "Color(.tertiarySystemFill)",
  // Vibrant Fills/Light/*
  "vibrant fills/light/vibrant primary": "Color(.systemFill)",
  "vibrant fills/light/vibrant secondary": "Color(.secondarySystemFill)",
  "vibrant fills/light/vibrant tertiary": "Color(.tertiarySystemFill)",
  // Vibrant Labels/Dark/*
  "vibrant labels/dark/vibrant primary": "Color(.label)",
  "vibrant labels/dark/vibrant secondary": "Color(.secondaryLabel)",
  "vibrant labels/dark/vibrant tertiary": "Color(.tertiaryLabel)",
  "vibrant labels/dark/vibrant quaternary": "Color(.quaternaryLabel)",
  // Vibrant Labels/Light/*
  "vibrant labels/light/vibrant primary": "Color(.label)",
  "vibrant labels/light/vibrant secondary": "Color(.secondaryLabel)",
  "vibrant labels/light/vibrant tertiary": "Color(.tertiaryLabel)",
  "vibrant labels/light/vibrant quaternary": "Color(.quaternaryLabel)",
};

function mapColorStyle(styleName: string): string | undefined {
  const lower = styleName.toLowerCase().trim();

  // Try the full hierarchical path first (e.g. "Backgrounds/Primary")
  const fromPath = appleColorStyleMap[lower];
  if (fromPath) return fromPath;

  // Try simple color name (e.g. "Red", "Primary")
  const fromSimple = swiftUISystemColors[lower];
  if (fromSimple) return fromSimple;

  // Try last segment of hierarchical path (e.g. "Accents/Teal" → "teal")
  const segments = lower.split("/");
  if (segments.length > 1) {
    const lastSegment = segments[segments.length - 1].trim();
    const fromLast = swiftUISystemColors[lastSegment];
    if (fromLast) return fromLast;
  }

  return undefined;
}

export interface MappedColor {
  expression: string;
  comment?: string;
}

export function mappedSwiftUIColor(color: Color): string {
  const result = mapSwiftUIColor(color);
  if (result.comment) return `${result.expression} // ${result.comment}`;
  return result.expression;
}

export function mapSwiftUIColor(color: Color): MappedColor {
  if (color.styleName) {
    const mapped = mapColorStyle(color.styleName);
    if (mapped) return { expression: mapped };
    return { expression: rgbColor(color), comment: color.styleName };
  }
  return { expression: rgbColor(color) };
}

function rgbColor(color: Color): string {
  const { red, blue, green, opacity } = color;
  if (opacity != null && opacity !== 1) {
    return `Color(red: ${truncated(red)}, green: ${truncated(
      green
    )}, blue: ${truncated(blue)}, opacity: ${truncated(opacity)})`;
  } else {
    return `Color(red: ${truncated(red)}, green: ${truncated(
      green
    )}, blue: ${truncated(blue)})`;
  }
}

const truncated = (value: number): string => {
  return value.toFixed(2).replace(/\.00$/, "");
};
