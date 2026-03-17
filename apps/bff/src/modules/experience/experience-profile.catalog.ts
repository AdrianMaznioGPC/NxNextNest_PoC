import type { ExperienceProfile } from "./experience-profile.types";

export const EXPERIENCE_RENDERER_VARIANTS: Record<string, string[]> = {
  "page.home": ["default"],
  "page.category-list": ["default"],
  "page.category-subcollections": ["default"],
  "page.category-products": ["default", "clp-list-v1", "clp-clearance-v1"],
  "page.product-detail": ["default"],
  "page.pdp-main": ["default"],
  "page.pdp-recommendations": ["default"],
  "page.pdp-reviews": ["default"],
  "page.pdp-faq": ["default"],
  "page.search-summary": ["default"],
  "page.search-products": ["default", "search-list-v1", "search-clearance-v1"],
  "page.search-results": ["default"],
  "page.content-page": ["default"],
  "page.cart": ["default"],
};

export const ALLOWED_THEME_KEYS = [
  "theme-default",
  "theme-green",
  "theme-orange",
] as const;

export const EXPERIENCE_PROFILES: ExperienceProfile[] = [
  {
    id: "exp-default-v1",
    storeKey: "*",
    routeKind: "*",
    locale: "*",
    layoutKey: "layout-default",
    slotRules: [],
  },
  {
    id: "exp-store-a-v1",
    storeKey: "store-a",
    routeKind: "*",
    locale: "*",
    layoutKey: "layout-default",
    slotRules: [],
  },
  {
    id: "exp-store-b-v1",
    storeKey: "store-b",
    routeKind: "*",
    locale: "*",
    layoutKey: "layout-list-first",
    slotRules: [],
  },
  {
    id: "exp-store-c-v1",
    storeKey: "store-c",
    routeKind: "*",
    locale: "*",
    layoutKey: "layout-default",
    slotRules: [],
  },
  {
    id: "exp-store-b-category-es-v1",
    storeKey: "store-b",
    routeKind: "category-detail",
    locale: "*",
    layoutKey: "layout-list-first",
    slotRules: [
      {
        rendererKey: "page.category-products",
        variantKey: "clp-list-v1",
        layoutKey: "list",
        density: "comfortable",
      },
    ],
  },
  {
    id: "exp-store-b-search-es-v1",
    storeKey: "store-b",
    routeKind: "search",
    locale: "*",
    layoutKey: "layout-list-first",
    slotRules: [
      {
        rendererKey: "page.search-products",
        variantKey: "search-list-v1",
        layoutKey: "list",
        density: "comfortable",
      },
    ],
  },
  {
    id: "exp-store-b-product-es-v1",
    storeKey: "store-b",
    routeKind: "product-detail",
    locale: "*",
    layoutKey: "layout-list-first",
    slotRules: [
      {
        rendererKey: "page.pdp-faq",
        include: false,
      },
      {
        rendererKey: "page.pdp-recommendations",
        include: false,
      },
      {
        rendererKey: "page.pdp-reviews",
        include: false,
      },
    ],
  },
  {
    id: "exp-store-b-category-nl-v1",
    storeKey: "store-c",
    routeKind: "category-detail",
    locale: "*",
    layoutKey: "layout-list-first",
    slotRules: [
      {
        rendererKey: "page.category-products",
        variantKey: "clp-list-v1",
        layoutKey: "list",
        density: "comfortable",
      },
      {
        rendererKey: "page.pdp-reviews",
        include: false,
      },
    ],
  },
];
