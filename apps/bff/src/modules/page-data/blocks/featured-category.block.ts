import type { Collection } from "@commerce/shared-types";
import type { CmsRawFeaturedCategory } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

registerBlockResolver(
  "featured-category",
  async (raw: CmsRawFeaturedCategory, ctx) => {
    const all = await ctx.catalogDomain.getCollections();
    const collections = raw.collectionHandles
      .map((h) => all.find((c) => c.handle === h))
      .filter((c): c is Collection => c !== undefined);

    return {
      type: "featured-category" as const,
      id: raw.id,
      heading: raw.heading,
      collections,
    };
  },
);
