import type { CmsRawProductCarousel } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

registerBlockResolver(
  "product-carousel",
  async (raw: CmsRawProductCarousel, ctx) => {
    const products = await ctx.productDomain.getCollectionProducts({
      collection: raw.collectionHandle,
    });

    return {
      type: "product-carousel" as const,
      id: raw.id,
      heading: raw.heading,
      products,
    };
  },
);
