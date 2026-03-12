import type { CmsBlock } from "lib/types";
import type { ComponentType } from "react";

type BlockRendererProps<T extends CmsBlock = CmsBlock> = { block: T };

const registry = new Map<string, ComponentType<BlockRendererProps<any>>>();

export function registerBlockRenderer<T extends CmsBlock>(
  type: T["type"],
  component: ComponentType<BlockRendererProps<T>>,
) {
  registry.set(type, component);
}

export function getBlockRenderer(
  type: string,
): ComponentType<BlockRendererProps> | undefined {
  return registry.get(type);
}
