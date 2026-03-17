import type { PageContentNode } from "lib/types";
import type { NodeRenderer } from "./node-types";

type NodeType = PageContentNode["type"];

const nodeRenderers: Record<NodeType, () => Promise<NodeRenderer<any>>> = {
  home: async () => (await import("./nodes/home-node")).HomeNode,
  "category-list": async () =>
    (await import("./nodes/category-list-node")).CategoryListNode,
  "category-subcollections": async () =>
    (await import("./nodes/category-subcollections-node"))
      .CategorySubcollectionsNode,
  "category-products": async () =>
    (await import("./nodes/category-products-node")).CategoryProductsNode,
  "product-detail": async () =>
    (await import("./nodes/product-detail-node")).ProductDetailNode,
  "search-results": async () =>
    (await import("./nodes/search-results-node")).SearchResultsNode,
  "content-page": async () =>
    (await import("./nodes/content-page-node")).ContentPageNode,
  "cart-page": async () => (await import("./nodes/cart-page-node")).CartPageNode,
};

export async function ResolvedPageRenderer({
  nodes,
}: {
  nodes: PageContentNode[];
}) {
  const renderedNodes = await Promise.all(
    nodes.map(async (node, index) => {
      const Renderer = await nodeRenderers[node.type]();
      return <Renderer key={`${node.type}-${index}`} node={node as any} />;
    }),
  );

  return <>{renderedNodes}</>;
}
