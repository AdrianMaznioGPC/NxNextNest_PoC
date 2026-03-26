import type { CmsBlock } from "lib/types";
import { Suspense } from "react";
import { getBlockRenderer } from "./block-registry";

export function BlockRenderer({ blocks }: { blocks: CmsBlock[] }) {
  return (
    <>
      {blocks.map((block) => {
        const Component = getBlockRenderer(block.type);
        if (!Component) {
          console.warn(`No renderer for block type "${block.type}"`);
          return null;
        }
        return (
          <Suspense key={block.id} fallback={null}>
            <Component block={block} />
          </Suspense>
        );
      })}
    </>
  );
}
