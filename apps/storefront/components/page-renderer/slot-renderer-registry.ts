import type { ExperienceRendererKey } from "lib/types";
import type { ReactNode } from "react";
import "server-only";

type AnySlotComponent = (props: Record<string, unknown>) => ReactNode;

type SlotLoader = () => Promise<AnySlotComponent>;

const slotLoaders: Record<ExperienceRendererKey, Record<string, SlotLoader>> = {
  "page.home": {
    default: async () =>
      (await import("./slots/home-slot")).default as AnySlotComponent,
  },
  "page.category-list": {
    default: async () =>
      (await import("./slots/category-list-slot")).default as AnySlotComponent,
  },
  "page.category-summary": {
    default: async () =>
      (await import("./slots/category-summary-slot"))
        .default as AnySlotComponent,
  },
  "page.category-subcollections": {
    default: async () =>
      (await import("./slots/category-subcollections-slot"))
        .default as AnySlotComponent,
  },
  "page.category-products": {
    default: async () =>
      (await import("./slots/category-products/default/server"))
        .default as AnySlotComponent,
    "clp-list-v1": async () =>
      (await import("./slots/category-products/clp-list-v1/server"))
        .default as AnySlotComponent,
    "clp-clearance-v1": async () =>
      (await import("./slots/category-products/clp-clearance-v1/server"))
        .default as AnySlotComponent,
  },
  "page.product-detail": {
    default: async () =>
      (await import("./slots/product-detail-slot")).default as AnySlotComponent,
  },
  "page.pdp-main": {
    default: async () =>
      (await import("./slots/pdp-main-slot")).default as AnySlotComponent,
  },
  "page.pdp-recommendations": {
    default: async () =>
      (await import("./slots/pdp-recommendations-slot"))
        .default as AnySlotComponent,
  },
  "page.pdp-reviews": {
    default: async () =>
      (await import("./slots/pdp-reviews-slot")).default as AnySlotComponent,
  },
  "page.pdp-faq": {
    default: async () =>
      (await import("./slots/pdp-faq-slot")).default as AnySlotComponent,
  },
  "page.search-summary": {
    default: async () =>
      (await import("./slots/search-summary-slot")).default as AnySlotComponent,
  },
  "page.search-products": {
    default: async () =>
      (await import("./slots/search-products/default/server"))
        .default as AnySlotComponent,
    "search-list-v1": async () =>
      (await import("./slots/search-products/search-list-v1/server"))
        .default as AnySlotComponent,
    "search-clearance-v1": async () =>
      (await import("./slots/search-products/search-clearance-v1/server"))
        .default as AnySlotComponent,
  },
  "page.search-results": {
    default: async () =>
      (await import("./slots/search-results-slot")).default as AnySlotComponent,
  },
  "page.content-page": {
    default: async () =>
      (await import("./slots/content-page-slot")).default as AnySlotComponent,
  },
  "page.cart": {
    default: async () =>
      (await import("./slots/cart-slot")).default as AnySlotComponent,
  },
  "page.checkout-header": {
    default: async () =>
      (await import("./slots/checkout-header-slot"))
        .default as AnySlotComponent,
  },
  "page.checkout-main": {
    default: async () =>
      (await import("./slots/checkout-main-slot")).default as AnySlotComponent,
    "single-page": async () =>
      (await import("./slots/checkout-main-slot"))
        .SinglePageCheckoutMainSlot as AnySlotComponent,
    "multi-step": async () =>
      (await import("./slots/checkout-main-slot"))
        .MultiStepCheckoutMainSlot as AnySlotComponent,
    express: async () =>
      (await import("./slots/checkout-main-slot"))
        .ExpressCheckoutMainSlot as AnySlotComponent,
  },
  "page.checkout-summary": {
    default: async () =>
      (await import("./slots/checkout-summary-slot"))
        .default as AnySlotComponent,
  },
};

export async function loadSlotRenderer(
  rendererKey: ExperienceRendererKey,
  variantKey = "default",
) {
  const variantLoaders = slotLoaders[rendererKey];
  const exact = variantLoaders[variantKey];
  if (exact) {
    return exact();
  }

  const fallback = variantLoaders.default;
  if (!fallback) return undefined;

  console.warn(
    `[SlotRendererRegistry] Unknown variant "${variantKey}" for renderer "${rendererKey}", using default`,
  );
  return fallback();
}
