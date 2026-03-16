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
