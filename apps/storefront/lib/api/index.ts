import { defaultStoreCode } from "@commerce/store-config";
import { TAGS } from "lib/constants";
import type {
  Cart,
  CategoryListPageData,
  CategoryPageData,
  CheckoutConfig,
  Collection,
  GlobalLayoutData,
  HomePageData,
  Menu,
  Page,
  Product,
  ProductPageData,
  SearchPageData,
} from "lib/types";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { cookies, headers } from "next/headers";

const BFF_URL = process.env.BFF_URL || "http://localhost:4000";

export async function getStoreCode(): Promise<string> {
  const h = await headers();
  return h.get("x-store-code") ?? defaultStoreCode;
}

async function bffFetch<T>(
  storeCode: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const hasBody = options?.body !== undefined;
  const res = await fetch(`${BFF_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody && { "Content-Type": "application/json" }),
      "x-store-code": storeCode,
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`BFF error: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text);
}

function qs(params: Record<string, string | boolean | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== false) sp.set(k, String(v));
  }
  const str = sp.toString();
  return str ? `?${str}` : "";
}

// -- Products ----------------------------------------------------------------

export async function getProducts(
  storeCode: string,
  {
    query,
    reverse,
    sortKey,
  }: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  },
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(storeCode, `/products${qs({ q: query, sortKey, reverse })}`);
}

export async function getProduct(
  storeCode: string,
  handle: string,
): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(storeCode, `/products/${handle}`);
}

export async function getProductRecommendations(
  storeCode: string,
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(storeCode, `/products/${productId}/recommendations`);
}

// -- Collections -------------------------------------------------------------

export async function getCollections(storeCode: string): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(storeCode, "/collections");
}

export async function getCollection(
  storeCode: string,
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(storeCode, `/collections/${handle}`);
}

export async function getCollectionByPath(
  storeCode: string,
  slugs: string[],
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(storeCode, `/collections/by-path/${slugs.join("/")}`);
}

export async function getCollectionProducts(
  storeCode: string,
  {
    collection,
    reverse,
    sortKey,
  }: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
  },
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  return bffFetch(
    storeCode,
    `/collections/${collection}/products${qs({ sortKey, reverse })}`,
  );
}

// -- Menu --------------------------------------------------------------------

export async function getMenu(
  storeCode: string,
  handle: string,
): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(storeCode, `/menus/${handle}`);
}

// -- Pages -------------------------------------------------------------------

export async function getPage(
  storeCode: string,
  handle: string,
): Promise<Page> {
  return bffFetch(storeCode, `/pages/${handle}`);
}

export async function getPages(storeCode: string): Promise<Page[]> {
  return bffFetch(storeCode, "/pages");
}

// -- Layout data -------------------------------------------------------------

export async function getLayoutData(
  storeCode: string,
): Promise<GlobalLayoutData> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(storeCode, "/page-data/layout");
}

// -- Page data contracts -----------------------------------------------------

export async function getHomePageData(
  storeCode: string,
): Promise<HomePageData> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(storeCode, "/page-data/home");
}

export async function getCategoryListPageData(
  storeCode: string,
): Promise<CategoryListPageData> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(storeCode, "/page-data/categories");
}

export async function getCategoryPageData(
  storeCode: string,
  categoryId: string,
  sortKey?: string,
  reverse?: boolean,
): Promise<CategoryPageData> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  return bffFetch(
    storeCode,
    `/page-data/categories/${categoryId}${qs({ sortKey, reverse })}`,
  );
}

export async function getProductPageData(
  storeCode: string,
  productId: string,
): Promise<ProductPageData> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(storeCode, `/page-data/product/${productId}`);
}

export async function getSearchPageData(
  storeCode: string,
  {
    query,
    sortKey,
    reverse,
  }: {
    query?: string;
    sortKey?: string;
    reverse?: boolean;
  },
): Promise<SearchPageData> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(
    storeCode,
    `/page-data/search${qs({ q: query, sortKey, reverse })}`,
  );
}

// -- Checkout ----------------------------------------------------------------

export async function getCheckoutConfig(
  storeCode: string,
): Promise<CheckoutConfig> {
  "use cache";
  cacheTag(TAGS.checkout);
  cacheLife("days");

  return bffFetch(storeCode, "/checkout/config");
}

// -- Cart --------------------------------------------------------------------

export async function getCart(): Promise<Cart | undefined> {
  const storeCode = await getStoreCode();
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) return undefined;
  try {
    const cart = await bffFetch<Cart | undefined>(storeCode, `/cart/${cartId}`);
    return cart || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Adds lines to the cart. Creates a new cart if no cartId cookie exists.
 * Persists the cart ID in a cookie from the BFF response.
 */
export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const storeCode = await getStoreCode();
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = await bffFetch<Cart>(storeCode, "/cart/lines", {
    method: "POST",
    body: JSON.stringify({ cartId, lines }),
  });
  if (!cartId && cart.id) {
    (await cookies()).set("cartId", cart.id);
  }
  return cart;
}

export async function removeFromCart(merchandiseIds: string[]): Promise<Cart> {
  const storeCode = await getStoreCode();
  const cartId = (await cookies()).get("cartId")?.value!;
  return bffFetch(storeCode, "/cart/remove", {
    method: "POST",
    body: JSON.stringify({ cartId, merchandiseIds }),
  });
}

export async function updateCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const storeCode = await getStoreCode();
  const cartId = (await cookies()).get("cartId")?.value!;
  return bffFetch(storeCode, "/cart/lines", {
    method: "PATCH",
    body: JSON.stringify({ cartId, lines }),
  });
}
