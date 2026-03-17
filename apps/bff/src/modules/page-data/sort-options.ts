import type { SortOption } from "@commerce/shared-types";

/**
 * Canonical sort options served by the BFF.
 * The FE should never hardcode these — it receives them as part of page-data responses
 * and uses the `labelKey` for i18n translation.
 */
export const SORT_OPTIONS: SortOption[] = [
  {
    slug: "relevance",
    labelKey: "sort.relevance",
    sortKey: "RELEVANCE",
    reverse: false,
    isDefault: true,
  },
  {
    slug: "trending-desc",
    labelKey: "sort.trending",
    sortKey: "BEST_SELLING",
    reverse: false,
  },
  {
    slug: "latest-desc",
    labelKey: "sort.latestArrivals",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    slug: "price-asc",
    labelKey: "sort.priceLowToHigh",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    slug: "price-desc",
    labelKey: "sort.priceHighToLow",
    sortKey: "PRICE",
    reverse: true,
  },
];

/** Resolve a slug to a sort option, falling back to the default. */
export function resolveSortOption(
  slug?: string,
): { sortKey: string; reverse: boolean } {
  if (!slug) {
    const def = SORT_OPTIONS.find((o) => o.isDefault) ?? SORT_OPTIONS[0]!;
    return { sortKey: def.sortKey, reverse: def.reverse };
  }
  const match = SORT_OPTIONS.find((o) => o.slug === slug);
  if (match) return { sortKey: match.sortKey, reverse: match.reverse };
  const def = SORT_OPTIONS.find((o) => o.isDefault) ?? SORT_OPTIONS[0]!;
  return { sortKey: def.sortKey, reverse: def.reverse };
}
