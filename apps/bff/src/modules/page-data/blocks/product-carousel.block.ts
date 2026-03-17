import type { CmsRawProductCarousel } from "../../../ports/cms.types";
import type { BlockResolver } from "../block-resolver-registry";

export const productCarouselResolver: BlockResolver<
  CmsRawProductCarousel
> = async (raw, ctx) => {
  const products = await ctx.productDomain.getCollectionProducts({
    collection: raw.collectionHandle,
  });

  return {
    type: "product-carousel" as const,
    id: raw.id,
    heading: raw.heading,
    products,
  };
};
