/**
 * Resolves the fill style or variable name for a node.
 * Handles traditional Figma styles, text-range styles, and bound variables.
 */
export function resolveFillStyleName(
  node: MinimalFillsMixin & SceneNode
): string | undefined {
  // 1. Traditional fill style
  const styleNode = node as SceneNode & {
    fillStyleId?: string | typeof figma.mixed;
  };
  if (styleNode.fillStyleId && styleNode.fillStyleId !== figma.mixed) {
    const style = figma.getStyleById(styleNode.fillStyleId as string);
    if (style) return style.name;
  }

  // 2. Text node range-based fill style
  if (node.type === "TEXT") {
    const textNode = node as TextNode;
    try {
      const rangeStyleId = textNode.getRangeFillStyleId(
        0,
        textNode.characters.length
      );
      if (rangeStyleId && rangeStyleId !== figma.mixed) {
        const style = figma.getStyleById(rangeStyleId as string);
        if (style) return style.name;
      }
    } catch {
      // getRangeFillStyleId may not be available
    }
  }

  // 3. Bound variables (Figma variables / design tokens)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const boundFills = (node as any).boundVariables?.fills;
    if (boundFills && boundFills.length > 0) {
      const binding = boundFills[0];
      if (binding?.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const variable = (figma as any).variables?.getVariableById(binding.id);
        if (variable) return variable.name;
      }
    }

    // Per-fill bound variable
    if (node.fills !== figma.mixed) {
      for (const fill of node.fills) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fillBinding = (fill as any).boundVariables?.color;
        if (fillBinding?.id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const variable = (figma as any).variables?.getVariableById(fillBinding.id);
          if (variable) return variable.name;
        }
      }
    }
  } catch {
    // Variables API may not be available
  }

  return undefined;
}
