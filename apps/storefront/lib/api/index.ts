import { defaultStoreCode } from "@commerce/store-config";
import { TAGS } from "lib/constants";
import type {
  BffErrorResponse,
  Cart,
  CategoryListPageData,
  CategoryPageData,
  CheckoutConfig,
  GlobalLayoutData,
  HomePageData,
  Menu,
  Page,
  ProductPageData,
  SavedAddress,
  SearchPageData,
  SitemapPageData,
} from "lib/types";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { cookies, headers } from "next/headers";

const BFF_URL = process.env.BFF_URL || "http://localhost:4000";

// -- BFF error ---------------------------------------------------------------

/**
 * Typed error wrapping the structured `BffErrorResponse` from the BFF.
 * Callers can inspect `.response` for the error code and message.
 */
export class BffError extends Error {
  constructor(public readonly response: BffErrorResponse) {
    super(response.message);
    this.name = "BffError";
  }
}

// -- Helpers -----------------------------------------------------------------

export async function getStoreCode(): Promise<string> {
  const h = await headers();
  return h.get("x-store-code") ?? defaultStoreCode;
}

export async function getCustomerId(): Promise<string | undefined> {
  return (await cookies()).get("customerId")?.value;
}

/** Build headers that identify the current customer (if authenticated). */
async function customerHeaders(): Promise<Record<string, string>> {
  const customerId = await getCustomerId();
  return customerId ? { "x-customer-id": customerId } : {};
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
    let errorBody: BffErrorResponse;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = {
        statusCode: res.status,
        errorCode: "UNKNOWN",
        message: res.statusText,
      };
    }
    const retryAfter = res.headers.get("Retry-After");
    if (retryAfter) {
      errorBody.details = {
        ...errorBody.details,
        retryAfterSeconds: Number(retryAfter),
      };
    }
    throw new BffError(errorBody);
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
  sort?: string,
  page?: number,
  pageSize?: number,
): Promise<CategoryPageData> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  return bffFetch(
    storeCode,
    `/page-data/categories/${categoryId}${qs({
      sort,
      page: page?.toString(),
      pageSize: pageSize?.toString(),
    })}`,
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
    sort,
    page,
    pageSize,
  }: {
    query?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
  },
): Promise<SearchPageData> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return bffFetch(
    storeCode,
    `/page-data/search${qs({
      q: query,
      sort,
      page: page?.toString(),
      pageSize: pageSize?.toString(),
    })}`,
  );
}

// -- Pages -------------------------------------------------------------------

export async function getPage(
  storeCode: string,
  handle: string,
): Promise<Page> {
  return bffFetch(storeCode, `/page-data/pages/${handle}`);
}

// -- Menus -------------------------------------------------------------------

export async function getMenu(
  storeCode: string,
  handle: string,
): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return bffFetch(storeCode, `/page-data/menus/${handle}`);
}

// -- Sitemap -----------------------------------------------------------------

export async function getSitemapData(
  storeCode: string,
  baseUrl: string,
): Promise<SitemapPageData> {
  "use cache";
  cacheTag(TAGS.products, TAGS.collections);
  cacheLife("days");

  return bffFetch(storeCode, `/page-data/sitemap${qs({ baseUrl })}`);
}

// -- Checkout ----------------------------------------------------------------

export async function getCheckoutConfig(
  storeCode: string,
): Promise<CheckoutConfig> {
  return bffFetch(storeCode, "/checkout/config", {
    headers: await customerHeaders(),
  });
}

/**
 * Asks the BFF for the checkout redirect URL.
 * The BFF owns the redirect target so the FE never sees external URLs directly.
 */
export async function getCheckoutRedirectUrl(): Promise<string> {
  const storeCode = await getStoreCode();
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId)
    throw new BffError({
      statusCode: 400,
      errorCode: "NO_CART",
      message: "No cart found",
    });
  const { redirectUrl } = await bffFetch<{ redirectUrl: string }>(
    storeCode,
    `/cart/${cartId}/checkout-redirect`,
    { method: "POST" },
  );
  return redirectUrl;
}

// -- Addresses ---------------------------------------------------------------

export async function getAddresses(storeCode: string): Promise<SavedAddress[]> {
  return bffFetch(storeCode, "/customers/me/addresses", {
    headers: await customerHeaders(),
  });
}

export async function createAddress(
  storeCode: string,
  address: Omit<SavedAddress, "id">,
): Promise<SavedAddress> {
  return bffFetch(storeCode, "/customers/me/addresses", {
    method: "POST",
    body: JSON.stringify(address),
    headers: await customerHeaders(),
  });
}

export async function updateAddress(
  storeCode: string,
  addressId: string,
  patch: Partial<Omit<SavedAddress, "id">>,
): Promise<SavedAddress> {
  return bffFetch(storeCode, `/customers/me/addresses/${addressId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
    headers: await customerHeaders(),
  });
}

export async function deleteAddress(
  storeCode: string,
  addressId: string,
): Promise<void> {
  return bffFetch(storeCode, `/customers/me/addresses/${addressId}`, {
    method: "DELETE",
    headers: await customerHeaders(),
  });
}

export async function setDefaultAddress(
  storeCode: string,
  addressId: string,
  type: "shipping" | "billing",
): Promise<SavedAddress> {
  return bffFetch(storeCode, `/customers/me/addresses/${addressId}/default`, {
    method: "POST",
    body: JSON.stringify({ type }),
    headers: await customerHeaders(),
  });
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
