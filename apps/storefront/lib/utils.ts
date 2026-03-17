import type { SortOption } from "lib/types";
import { ReadonlyURLSearchParams } from "next/navigation";

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export function productUrl(product: { handle: string; id: string }): string {
  return `/product/${product.handle}/p/${product.id}`;
}

export function categoryUrl(collection: {
  handle: string;
  id: string;
}): string {
  return `/categories/${collection.handle}/c/${collection.id}`;
}

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

/**
 * Resolves a sort slug to sortKey + reverse using BFF-provided sort options.
 * Falls back to the default sort option if no match is found.
 */
export function resolveSortFromSlug(
  slug: string | undefined,
  sortOptions: SortOption[],
): { sortKey: string; reverse: boolean } {
  if (slug) {
    const match = sortOptions.find((o) => o.slug === slug);
    if (match) return { sortKey: match.sortKey, reverse: match.reverse };
  }
  const def = sortOptions.find((o) => o.isDefault) ?? sortOptions[0];
  if (def) return { sortKey: def.sortKey, reverse: def.reverse };
  return { sortKey: "RELEVANCE", reverse: false };
}
