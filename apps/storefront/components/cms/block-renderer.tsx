import type { CmsBlock } from "lib/types";
import { getBlockRenderer } from "./block-registry";
import { registerAllBlockRenderers } from "./blocks";

registerAllBlockRenderers();

export function BlockRenderer({ blocks }: { blocks: CmsBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block) => {
        const Component = getBlockRenderer(block.type);
        if (!Component) {
          console.warn(`No renderer for block type "${block.type}"`);
          return null;
        }
        return <Component key={block.id} block={block} />;
      })}
    </div>
  );
}
