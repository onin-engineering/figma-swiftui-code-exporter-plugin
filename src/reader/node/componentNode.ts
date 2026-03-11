import {
  ChildrenMixin,
  HStack,
  Spacer,
  View,
  VStack,
  ZStack,
} from "../../types/views";
import { trace } from "../tracer";
import { FigmaContext } from "../context";
import { traverse } from "../entrypoint";
import { appendBackgroundColor } from "../modifiers/backgroundColor";
import { appendPadding } from "../modifiers/padding";
import { appendFrameModifierWithFrameNode } from "../modifiers/frame";
import { appendCornerRadius } from "../modifiers/cornerRadius";
import { appendBorder } from "../modifiers/border";
import { appendPosition } from "../modifiers/position";
import { appendDropShadow } from "../modifiers/dropShadow";

export function walkToComponent(context: FigmaContext, node: ComponentNode) {
  trace(`#walkToComponent`, context, node);
  const { children, remote } = node;

  if (remote) {
    return;
  }

  if (children.length > 1) {
    // Respect auto-layout just like walkToFrame does
    const layoutNode = node as unknown as FrameNode;
    const {
      layoutMode,
      itemSpacing,
      counterAxisAlignItems,
      primaryAxisAlignItems,
    } = layoutNode;

    let containerReference!: ChildrenMixin & View;
    if (layoutMode === "HORIZONTAL") {
      const hstack: HStack = {
        type: "HStack",
        axis: "H",
        modifiers: [],
        node: node,
        children: [],
        alignment: (function () {
          if (counterAxisAlignItems === "MIN") {
            return "top";
          } else if (counterAxisAlignItems === "MAX") {
            return "bottom";
          } else {
            return "center";
          }
        })(),
        spacing: itemSpacing,
      };
      containerReference = hstack;
    } else if (layoutMode === "VERTICAL") {
      const vstack: VStack = {
        type: "VStack",
        axis: "V",
        modifiers: [],
        node: node,
        children: [],
        alignment: (function () {
          if (counterAxisAlignItems === "MIN") {
            return "leading";
          } else if (counterAxisAlignItems === "MAX") {
            return "trailing";
          } else {
            return "center";
          }
        })(),
        spacing: itemSpacing,
      };
      containerReference = vstack;
    } else {
      const zstack: ZStack = {
        type: "ZStack",
        axis: "Z",
        modifiers: [],
        node: node,
        children: [],
      };
      containerReference = zstack;
    }

    context.nestContainer(containerReference);

    children.forEach((child, index) => {
      traverse(context, child);
      if (
        primaryAxisAlignItems === "SPACE_BETWEEN" &&
        index !== children.length - 1
      ) {
        const spacer: Spacer = {
          type: "Spacer",
          modifiers: [],
          node: null,
        };
        context.addChild(spacer);
      }
    });

    appendPadding(context, containerReference, layoutNode);
    appendFrameModifierWithFrameNode(context, containerReference, layoutNode);
    appendBackgroundColor(context, containerReference, node);
    appendCornerRadius(context, containerReference, layoutNode);
    appendBorder(context, containerReference, layoutNode);
    appendPosition(context, containerReference, layoutNode);
    appendDropShadow(context, containerReference, layoutNode);

    context.unnestContainer();
  } else if (children.length === 1) {
    const child = children[0];
    traverse(context, child);
    const targetView = context.findBy(child);
    if (targetView != null) {
      appendBackgroundColor(context, targetView, node);
    }
  }
}
