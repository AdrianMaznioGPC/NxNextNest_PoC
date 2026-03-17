import type { CmsRawFeaturedProducts } from "../../../ports/cms.types";
import type { BlockResolver } from "../block-resolver-registry";

export const featuredProductsResolver: BlockResolver<
  CmsRawFeaturedProducts
> = async (raw, ctx) => {
  const products = await ctx.productDomain.getProductsByHandles(
    raw.productHandles,
  );

  return {
    type: "featured-products" as const,
    id: raw.id,
    heading: raw.heading,
    products,
  };
};
