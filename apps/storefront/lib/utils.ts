import type { ListingProduct } from "lib/types";
import { ReadonlyURLSearchParams } from "next/navigation";

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export function productUrl(product: { handle: string; id: string }): string {
  return `/product/${product.handle}/p/${product.id}`;
}

/**
 * Builds a PDP URL for a listing product with the variant pre-selected
 * via query params (e.g. `/product/brake-pads/p/p-1?axle=Front`).
 */
export function listingProductUrl(item: ListingProduct): string {
  const base = `/product/${item.productHandle}/p/${item.productId}`;
  if (!item.selectedOptions?.length) return base;
  const params = new URLSearchParams();
  for (const opt of item.selectedOptions) {
    params.set(opt.name.toLowerCase(), opt.value);
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
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
