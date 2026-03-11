import { AssertionError } from "assert";

export const nonNullable = <T>(value: T): value is NonNullable<T> =>
  value != null;

export function assert(
  condition: boolean,
  message?: string
): asserts condition {
  if (!condition) {
    throw new AssertionError({ message });
  }
}

export function sanitizeSwiftIdentifier(name?: string | null): string | null {
  if (!name) return null;

  const parts = name.split(/[\s\-_]+/).filter((p) => p.length > 0);
  const pascal = parts
    .map((part) => {
      const cleaned = part.replace(/[^a-zA-Z0-9_]/g, "");
      if (cleaned.length === 0) return "";
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    })
    .join("");

  if (pascal.length === 0) return null;

  if (/^[0-9]/.test(pascal)) {
    return `_${pascal}`;
  }

  return pascal;
}
