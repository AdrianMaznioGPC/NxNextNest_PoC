import type { CmsBlock } from "@commerce/shared-types";
import type { CmsRawBlock, CmsRawBlockOf } from "../../ports/cms.types";
import type { CollectionPort } from "../../ports/collection.port";
import type { NavigationPort } from "../../ports/navigation.port";
import type { ProductPort } from "../../ports/product.port";

export type BlockResolverContext = {
  products: ProductPort;
  collections: CollectionPort;
  navigation: NavigationPort;
};

export type BlockResolver<T = any> = (
  raw: T,
  ctx: BlockResolverContext,
) => Promise<CmsBlock | null>;

const resolvers = new Map<string, BlockResolver>();

export function registerBlockResolver<T extends CmsRawBlock["type"]>(
  type: T,
  resolver: BlockResolver<CmsRawBlockOf<T>>,
) {
  resolvers.set(type, resolver as BlockResolver);
}

export async function resolveBlocks(
  rawBlocks: CmsRawBlock[],
  ctx: BlockResolverContext,
): Promise<CmsBlock[]> {
  const results = await Promise.all(
    rawBlocks.map((raw) => {
      const resolver = resolvers.get(raw.type);
      if (!resolver) {
        console.warn(`[BlockResolver] No resolver for "${raw.type}"`);
        return null;
      }
      return resolver(raw, ctx);
    }),
  );
  return results.filter((b): b is CmsBlock => b !== null);
}
