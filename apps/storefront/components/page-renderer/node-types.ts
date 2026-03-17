import type { PageContentNode } from "lib/types";
import type { ReactNode } from "react";

export type NodeProps<T extends PageContentNode["type"]> = {
  node: Extract<PageContentNode, { type: T }>;
};

export type NodeRenderer<T extends PageContentNode["type"]> = (
  props: NodeProps<T>,
) => ReactNode;
