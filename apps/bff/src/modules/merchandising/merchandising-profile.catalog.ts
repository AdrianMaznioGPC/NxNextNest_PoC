import type { MerchandisingProfile } from "./merchandising-profile.types";

export const ALLOWED_MERCHANDISING_SORT_SLUGS = [
  "trending-desc",
  "price-asc",
  "price-desc",
  "latest-desc",
] as const;

export const MERCHANDISING_PROFILES: MerchandisingProfile[] = [
  {
    id: "merch-default-v1",
    storeKey: "*",
    routeKind: "*",
    language: "*",
    mode: "discovery",
    directives: {
      slotRules: [],
    },
  },
  {
    id: "merch-store-a-category-conversion-v1",
    storeKey: "store-a",
    routeKind: "category-detail",
    language: "*",
    mode: "conversion",
    directives: {
      defaultSortSlug: "trending-desc",
      slotRules: [
        {
          rendererKey: "page.category-products",
          variantKey: "clp-list-v1",
          layoutKey: "list",
          density: "comfortable",
        },
      ],
    },
  },
  {
    id: "merch-store-a-search-conversion-v1",
    storeKey: "store-a",
    routeKind: "search",
    language: "*",
    mode: "conversion",
    directives: {
      defaultSortSlug: "trending-desc",
      slotRules: [
        {
          rendererKey: "page.search-products",
          variantKey: "search-list-v1",
          layoutKey: "list",
          density: "comfortable",
        },
      ],
    },
  },
  {
    id: "merch-store-a-product-clearance-v1",
    storeKey: "store-a",
    routeKind: "product-detail",
    language: "*",
    mode: "clearance",
    directives: {
      slotRules: [
        {
          rendererKey: "page.pdp-faq",
          include: false,
        },
        {
          rendererKey: "page.pdp-reviews",
          include: false,
        },
      ],
    },
  },
  {
    id: "merch-store-c-category-clearance-v1",
    storeKey: "store-c",
    routeKind: "category-detail",
    language: "*",
    mode: "clearance",
    directives: {
      defaultSortSlug: "price-asc",
      slotRules: [
        {
          rendererKey: "page.category-products",
          variantKey: "clp-clearance-v1",
          layoutKey: "list",
          density: "compact",
          flags: {
            emphasizePrice: true,
          },
        },
      ],
    },
  },
  {
    id: "merch-store-c-search-clearance-v1",
    storeKey: "store-c",
    routeKind: "search",
    language: "*",
    mode: "clearance",
    directives: {
      defaultSortSlug: "price-asc",
      slotRules: [
        {
          rendererKey: "page.search-products",
          variantKey: "search-clearance-v1",
          layoutKey: "list",
          density: "compact",
          flags: {
            emphasizePrice: true,
          },
        },
      ],
    },
  },
];
