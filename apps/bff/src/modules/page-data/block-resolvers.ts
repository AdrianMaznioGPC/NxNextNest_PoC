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
      raw.productHandles.map((h: string) => ctx.products.getProduct(h)),
    )
  ).filter((p): p is Product => p !== undefined);

  return {
    type: "featured-products" as const,
    id: raw.id,
    heading: raw.heading,
    products,
  };
});

// product-carousel: resolve collection → products
registerBlockResolver("product-carousel", async (raw, ctx) => {
  const products = await ctx.collections.getCollectionProducts({
    collection: raw.collectionHandle,
  });

  return {
    type: "product-carousel" as const,
    id: raw.id,
    heading: raw.heading,
    products,
  };
});

// cms-banner: pass through (pure content, single full-width banner)
registerBlockResolver("cms-banner", async (raw) => ({
  type: "cms-banner" as const,
  id: raw.id,
  heading: raw.heading,
  subheading: raw.subheading,
  ctaLabel: raw.ctaLabel,
  ctaUrl: raw.ctaUrl,
  image: raw.image,
  overlayOpacity: raw.overlayOpacity,
}));

// banner-grid: container block holding multiple banners in a column layout
registerBlockResolver("banner-grid", async (raw) => ({
  type: "banner-grid" as const,
  id: raw.id,
  columns: raw.columns,
  banners: raw.banners,
}));

// featured-category: resolve handles → full collections
registerBlockResolver("featured-category", async (raw, ctx) => {
  const all = await ctx.collections.getCollections();
  const collections = raw.collectionHandles
    .map((h: string) => all.find((c) => c.handle === h))
    .filter((c): c is Collection => c !== undefined);

  return {
    type: "featured-category" as const,
    id: raw.id,
    heading: raw.heading,
    collections,
  };
});

// social-proof: pass through (pure content)
registerBlockResolver("social-proof", async (raw) => ({
  type: "social-proof" as const,
  id: raw.id,
  heading: raw.heading,
  testimonials: raw.testimonials,
}));

// homepage-hero: enrich with mega menu from navigation port
registerBlockResolver("homepage-hero", async (raw, ctx) => {
  const megaMenu = await ctx.navigation.getMegaMenu();

  return {
    type: "homepage-hero" as const,
    id: raw.id,
    megaMenu,
    mainBanner: raw.mainBanner,
    usps: raw.usps,
    smallBanners: raw.smallBanners,
  };
});
