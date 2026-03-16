import type { CmsRawFeaturedProducts } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

registerBlockResolver(
  "featured-products",
  async (raw: CmsRawFeaturedProducts, ctx) => {
    const products = await ctx.productDomain.getProductsByHandles(
      raw.productHandles,
    );

    return {
      type: "featured-products" as const,
      id: raw.id,
      heading: raw.heading,
      products,
    };
  },
);
