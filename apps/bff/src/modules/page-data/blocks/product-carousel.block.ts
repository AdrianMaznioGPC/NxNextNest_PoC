import { registerBlockResolver } from "../block-resolver-registry";

export type CmsRawProductCarousel = {
  type: "product-carousel";
  id: string;
  heading: string;
  collectionHandle: string;
};

registerBlockResolver(
  "product-carousel",
  async (raw: CmsRawProductCarousel, ctx) => {
    const products = await ctx.collections.getCollectionProducts({
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
