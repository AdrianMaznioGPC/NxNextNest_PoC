import type { CmsBlock } from "lib/types";
import type { ComponentType } from "react";
import { lazy } from "react";

type BlockRendererProps<T extends CmsBlock = CmsBlock> = { block: T };

// Map block types to their import paths
const blockComponentPaths: Record<string, () => Promise<any>> = {
  "hero-banner": () => import("./blocks/hero-banner"),
  "featured-products": () => import("./blocks/featured-products"),
  "featured-categories": () => import("./blocks/featured-categories"),
  "product-carousel": () => import("./blocks/product-carousel"),
  "rich-text": () => import("./blocks/rich-text"),
  "winter-effects": () => import("./blocks/winter-effects"),
};

// Cache for loaded components
const componentCache = new Map<
  string,
  ComponentType<BlockRendererProps<any>>
>();

export function getBlockRenderer(
  type: string,
): ComponentType<BlockRendererProps> | undefined {
  // Return cached component if available
  if (componentCache.has(type)) {
    return componentCache.get(type);
  }

  // Get the import function
  const importFn = blockComponentPaths[type];
  if (!importFn) {
    console.warn(`No block component defined for type "${type}"`);
    return undefined;
  }

  // Create lazy component
  const LazyComponent = lazy(() =>
    importFn().then((mod) => ({ default: mod.default })),
  );

  // Cache it
  componentCache.set(type, LazyComponent as any);
  return LazyComponent as any;
}

// For backwards compatibility or manual registration
export function registerBlockRenderer<T extends CmsBlock>(
  type: T["type"],
  component: ComponentType<BlockRendererProps<T>>,
) {
  componentCache.set(type, component);
}
