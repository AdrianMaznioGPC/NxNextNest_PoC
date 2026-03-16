import type { Product } from "@commerce/shared-types";
import type { CmsRawFeaturedProducts } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

registerBlockResolver(
  "featured-products",
  async (raw: CmsRawFeaturedProducts, ctx) => {
    const products = (
      await Promise.all(
        raw.productHandles.map((h) => ctx.products.getProduct(h)),
      )
    ).filter((p): p is Product => p !== undefined);

    return {
      type: "featured-products" as const,
      id: raw.id,
      heading: raw.heading,
      products,
    };
  },
);
