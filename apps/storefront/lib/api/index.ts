import { TAGS } from "lib/constants";
import type {
  Cart,
  CategoryListPageData,
  CategoryPageData,
  Collection,
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
import { cookies } from "next/headers";

const BFF_URL = process.env.BFF_URL || "http://localhost:4000";

async function bffFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BFF_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(`/products${qs({ q: query, sortKey, reverse })}`);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(`/products/${handle}`);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(`/products/${productId}/recommendations`);
}

// -- Collections -------------------------------------------------------------

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch("/collections");
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(`/collections/${handle}`);
}

export async function getCollectionByPath(
  slugs: string[],
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(`/collections/by-path/${slugs.join("/")}`);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  // Use by-path endpoint for nested collection keys (e.g. "brakes/pads")
  const path = collection.includes("/")
    ? `/collections/by-path/${collection}/products`
    : `/collections/${collection}/products`;

  return bffFetch(`${path}${qs({ sortKey, reverse })}`);
}

// -- Menu --------------------------------------------------------------------

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(`/menus/${handle}`);
}

// -- Pages -------------------------------------------------------------------

export async function getPage(handle: string): Promise<Page> {
  return bffFetch(`/pages/${handle}`);
}

export async function getPages(): Promise<Page[]> {
  return bffFetch("/pages");
}

// -- Page data contracts -----------------------------------------------------

export async function getHomePageData(): Promise<HomePageData> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch("/page-data/home");
}

export async function getCategoryListPageData(): Promise<CategoryListPageData> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch("/page-data/categories");
}

export async function getCategoryPageData(
  slugs: string[],
  sortKey?: string,
  reverse?: boolean,
): Promise<CategoryPageData> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  return bffFetch(
    `/page-data/categories/${slugs.join("/")}${qs({ sortKey, reverse })}`,
  );
}

export async function getProductPageData(
  handle: string,
): Promise<ProductPageData> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(`/page-data/product/${handle}`);
}

export async function getSearchPageData({
  query,
  sortKey,
  reverse,
}: {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<SearchPageData> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(`/page-data/search${qs({ q: query, sortKey, reverse })}`);
}

// -- Cart --------------------------------------------------------------------

export async function createCart(): Promise<Cart> {
  return bffFetch("/cart", { method: "POST" });
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) return undefined;
  try {
    const cart = await bffFetch<Cart | undefined>(`/cart/${cartId}`);
    return cart || undefined;
  } catch {
    return undefined;
  }
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  return bffFetch(`/cart/${cartId}/lines`, {
    method: "POST",
    body: JSON.stringify({ lines }),
  });
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  return bffFetch(`/cart/${cartId}/lines`, {
    method: "DELETE",
    body: JSON.stringify({ lineIds }),
  });
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  return bffFetch(`/cart/${cartId}/lines`, {
    method: "PATCH",
    body: JSON.stringify({ lines }),
  });
}
