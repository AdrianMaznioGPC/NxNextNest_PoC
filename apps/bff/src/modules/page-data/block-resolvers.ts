import type { Collection, Product } from "@commerce/shared-types";
import { registerBlockResolver } from "./block-resolver-registry";

// hero-banner: no backend data to resolve, pass through
registerBlockResolver("hero-banner", async (raw) => ({
  type: "hero-banner" as const,
  id: raw.id,
  heading: raw.heading,
  subheading: raw.subheading,
  ctaLabel: raw.ctaLabel,
  ctaUrl: raw.ctaUrl,
  image: raw.image,
}));

// rich-text: pass through
registerBlockResolver("rich-text", async (raw) => ({
  type: "rich-text" as const,
  id: raw.id,
  html: raw.html,
}));

// featured-products: resolve handles → full products
registerBlockResolver("featured-products", async (raw, ctx) => {
  const products = (
    await Promise.all(
      raw.productHandles.map((h: string) =>
        ctx.products.getProduct(h, ctx.localeContext),
      ),
    )
  ).filter((p): p is Product => p !== undefined);

  return {
    type: "featured-products" as const,
    id: raw.id,
    heading: raw.heading,
    products,
  };
});

// featured-categories: resolve handles → full collections
registerBlockResolver("featured-categories", async (raw, ctx) => {
  const categories = (
    await Promise.all(
      raw.categoryHandles.map((h: string) =>
        ctx.collections.getCollection(h, ctx.localeContext),
      ),
    )
  ).filter((c): c is Collection => c !== undefined);

  return {
    type: "featured-categories" as const,
    id: raw.id,
    heading: raw.heading,
    categories,
  };
});

// product-carousel: resolve collection → products
registerBlockResolver("product-carousel", async (raw, ctx) => {
  const products = await ctx.collections.getCollectionProducts(
    {
      collection: raw.collectionHandle,
    },
    ctx.localeContext,
  );

  return {
    type: "product-carousel" as const,
    id: raw.id,
    heading: raw.heading,
    products,
  };
});

// winter-effects: no backend data to resolve, pass through
registerBlockResolver("winter-effects", async (raw) => ({
  type: "winter-effects" as const,
  id: raw.id,
  snowflakeCount: raw.snowflakeCount,
  speed: raw.speed,
  wind: raw.wind,
  radius: raw.radius,
}));
