const KEYWORDS = new Set([
  "import", "struct", "var", "let", "func", "some", "return",
  "if", "else", "for", "in", "while", "switch", "case", "default",
  "break", "continue", "true", "false", "nil", "self",
  "private", "public", "internal", "static", "class", "enum",
  "protocol", "extension", "guard", "where", "typealias",
]);

const TYPES = new Set([
  "SwiftUI", "View", "Text", "Image", "Color", "Font",
  "VStack", "HStack", "ZStack", "Spacer", "Divider",
  "Button", "ScrollView", "List", "Section", "Group",
  "NavigationView", "NavigationStack", "TabView",
  "LazyVGrid", "LazyHGrid", "GridItem",
  "TextField", "Toggle", "Slider", "Picker",
  "Rectangle", "Circle", "Capsule", "RoundedRectangle",
  "Path", "Shape", "AnyView",
  "String", "Int", "Double", "Float", "Bool",
  "CGFloat", "Alignment", "Edge", "EdgeInsets",
  "LinearGradient", "RadialGradient", "Gradient",
]);

const COLORS: Record<string, string> = {
  keyword: "#9b2393",
  type: "#0b4f79",
  string: "#c41a16",
  number: "#1c00cf",
  comment: "#5d6c79",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function span(type: string, content: string): string {
  const color = COLORS[type];
  if (!color) return content;
  const style = type === "comment"
    ? `color:${color};font-style:italic`
    : `color:${color}`;
  return `<span style="${style}">${content}</span>`;
}

interface Token {
  type: "keyword" | "type" | "string" | "number" | "comment" | "plain";
  value: string;
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Line comment
    if (code[i] === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const value = end === -1 ? code.substring(i) : code.substring(i, end);
      tokens.push({ type: "comment", value });
      i += value.length;
      continue;
    }

    // String literal
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"' && code[j] !== "\n") {
        if (code[j] === "\\") j++;
        j++;
      }
      if (j < code.length && code[j] === '"') j++;
      tokens.push({ type: "string", value: code.substring(i, j) });
      i = j;
      continue;
    }

    // # macro (e.g. #Preview)
    if (code[i] === "#" && i + 1 < code.length && /[A-Za-z]/.test(code[i + 1])) {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      tokens.push({ type: "keyword", value: code.substring(i, j) });
      i = j;
      continue;
    }

    // Word (identifier or keyword)
    if (/[A-Za-z_]/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      const word = code.substring(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (TYPES.has(word)) {
        tokens.push({ type: "type", value: word });
      } else {
        tokens.push({ type: "plain", value: word });
      }
      i = j;
      continue;
    }

    // @ attribute
    if (code[i] === "@") {
      let j = i + 1;
      while (j < code.length && /\w/.test(code[j])) j++;
      tokens.push({ type: "keyword", value: code.substring(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/\d/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      tokens.push({ type: "number", value: code.substring(i, j) });
      i = j;
      continue;
    }

    // Everything else (whitespace, operators, punctuation)
    tokens.push({ type: "plain", value: code[i] });
    i++;
  }

  return tokens;
}

export function highlightSwift(code: string): string {
  const tokens = tokenize(code);
  return tokens
    .map((t) => {
      const escaped = escapeHtml(t.value);
      if (t.type === "plain") return escaped;
      return span(t.type, escaped);
    })
    .join("");
}
