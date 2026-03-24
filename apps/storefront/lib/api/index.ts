import { TAGS } from "lib/constants";
import type {
  Cart,
  Collection,
  DomainConfigModel,
  GlobalLayoutData,
  I18nMessagesModel,
  LocaleContext,
  Menu,
  OrderConfirmation,
  Page,
  PageBootstrapModel,
  PlaceOrderRequest,
  Product,
  SavedAddress,
  SlotPayloadModel,
  SlotReference,
  SwitchUrlRequest,
  SwitchUrlResponse,
} from "lib/types";

import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { cookies } from "next/headers";
import { cache } from "react";

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

function normalizeQuery(
  query: Record<string, string | undefined>,
): Record<string, string | undefined> {
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) normalized[key] = value;
  }
  return normalized;
}

function sortedRecordEntries(record: Record<string, string>) {
  return Object.entries(record).sort(([a], [b]) => a.localeCompare(b));
}

function buildQueryString(query: Record<string, string>) {
  return new URLSearchParams(sortedRecordEntries(query)).toString();
}

function localeQuery(localeContext?: Partial<LocaleContext>) {
  return {
    locale: localeContext?.locale,
    language: localeContext?.language,
    region: localeContext?.region,
    currency: localeContext?.currency,
    market: localeContext?.market,
    domain: localeContext?.domain,
  };
}

function languageScopedTag(
  resource: "products" | "collections" | "menus" | "pages",
  localeContext?: Partial<LocaleContext>,
) {
  const language = localeContext?.language;
  return language ? `${resource}:lang:${language}` : undefined;
}

// -- Products ----------------------------------------------------------------

export async function getProducts(
  {
    query,
    reverse,
    sortKey,
  }: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  },
  localeContext?: Partial<LocaleContext>,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  const productsLanguageTag = languageScopedTag("products", localeContext);
  if (productsLanguageTag) {
    cacheTag(productsLanguageTag);
  }
  cacheLife("days");

  return bffFetch(
    `/products${qs({ q: query, sortKey, reverse, ...localeQuery(localeContext) })}`,
  );
}

// -- Collections -------------------------------------------------------------

export async function getCollections(
  localeContext?: Partial<LocaleContext>,
): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  const collectionsLanguageTag = languageScopedTag(
    "collections",
    localeContext,
  );
  if (collectionsLanguageTag) {
    cacheTag(collectionsLanguageTag);
  }
  cacheLife("days");

  return bffFetch(`/collections${qs(localeQuery(localeContext))}`);
}

// -- Menu --------------------------------------------------------------------

export async function getMenu(
  handle: string,
  localeContext?: Partial<LocaleContext>,
): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  const menusLanguageTag = languageScopedTag("menus", localeContext);
  if (menusLanguageTag) {
    cacheTag(menusLanguageTag);
  }
  cacheLife("days");

  return bffFetch(`/menus/${handle}${qs(localeQuery(localeContext))}`);
}

// -- Pages -------------------------------------------------------------------

export async function getPages(
  localeContext?: Partial<LocaleContext>,
): Promise<Page[]> {
  "use cache";
  cacheTag(TAGS.pages);
  const pagesLanguageTag = languageScopedTag("pages", localeContext);
  if (pagesLanguageTag) {
    cacheTag(pagesLanguageTag);
  }
  cacheLife("days");

  return bffFetch(`/pages${qs(localeQuery(localeContext))}`);
}

// -- Layout data -------------------------------------------------------------

export async function getLayoutData(
  localeContext?: Partial<LocaleContext>,
): Promise<GlobalLayoutData> {
  "use cache";
  cacheTag(TAGS.collections);
  const collectionsLanguageTag = languageScopedTag(
    "collections",
    localeContext,
  );
  const menusLanguageTag = languageScopedTag("menus", localeContext);
  if (collectionsLanguageTag && menusLanguageTag) {
    cacheTag(collectionsLanguageTag, menusLanguageTag);
  } else if (collectionsLanguageTag) {
    cacheTag(collectionsLanguageTag);
  } else if (menusLanguageTag) {
    cacheTag(menusLanguageTag);
  }
  cacheLife("days");

  return bffFetch(
    `/page-data/layout${qs({
      ...localeQuery(localeContext),
    })}`,
  );
}

export async function getPageBootstrap(
  path: string,
  query: Record<string, string | undefined> = {},
  localeContext?: Partial<LocaleContext>,
): Promise<PageBootstrapModel> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const finalQuery = normalizeQuery(query);
  const bootstrap = await bffFetch<PageBootstrapModel>(
    `/page-data/bootstrap${qs({
      path: normalizedPath,
      ...finalQuery,
      ...localeQuery(localeContext),
    })}`,
    {
      cache: "no-store",
      headers: await cookieHeader(),
    },
  );
  return bootstrap;
}

const getSlotPayloadCached = cache(
  async (
    endpoint: string,
    normalizedQueryString: string,
  ): Promise<SlotPayloadModel> => {
    "use cache";
    cacheLife("minutes");

    const payload = await bffFetch<SlotPayloadModel>(
      `${endpoint}?${normalizedQueryString}`,
    );
    if (payload.revalidateTags.length > 0) {
      cacheTag(...payload.revalidateTags);
    }
    return payload;
  },
);

export async function getSlotPayload(slotRef: SlotReference) {
  const normalizedQuery = buildQueryString(slotRef.query);
  return getSlotPayloadCached(slotRef.endpoint, normalizedQuery);
}

export async function getDomainConfig(): Promise<DomainConfigModel> {
  "use cache";
  cacheLife("minutes");
  return bffFetch("/i18n/domain-config");
}

export async function resolveSwitchUrl(
  payload: SwitchUrlRequest,
): Promise<SwitchUrlResponse> {
  return bffFetch("/i18n/switch-url", {
    method: "POST",
    cache: "no-store",
    body: JSON.stringify(payload),
  });
}

// -- I18n (direct) -----------------------------------------------------------

export async function getMessages(
  locale: string,
  namespaces: string[],
): Promise<I18nMessagesModel> {
  return bffFetch(
    `/i18n/messages${qs({ locale, namespaces: namespaces.join(",") })}`,
  );
}

// -- Cart --------------------------------------------------------------------

export async function getCart(
  localeContext?: Partial<LocaleContext>,
): Promise<Cart | undefined> {
  try {
    const cart = await bffFetch<Cart | undefined>(
      `/cart/current${qs(localeQuery(localeContext))}`,
      {
        headers: await cookieHeader(),
      },
    );
    return cart || undefined;
  } catch {
    return undefined;
  }
}

// -- Checkout ----------------------------------------------------------------

export async function placeOrder(
  request: PlaceOrderRequest,
): Promise<OrderConfirmation> {
  return bffFetch("/checkout/orders", {
    method: "POST",
    cache: "no-store",
    headers: await cookieHeader(),
    body: JSON.stringify(request),
  });
}

export async function getOrderConfirmation(
  orderId: string,
): Promise<OrderConfirmation> {
  return bffFetch(`/checkout/orders/${orderId}`, {
    cache: "no-store",
    headers: await cookieHeader(),
  });
}

export async function createAddress(
  address: Omit<SavedAddress, "id">,
): Promise<SavedAddress> {
  return bffFetch("/customer/addresses", {
    method: "POST",
    cache: "no-store",
    headers: await cookieHeader(),
    body: JSON.stringify(address),
  });
}

// -- Internal helpers --------------------------------------------------------

async function cookieHeader(): Promise<Record<string, string> | undefined> {
  const cookieStore = await cookies();
  const rawCookies = cookieStore.toString();
  if (!rawCookies) {
    return undefined;
  }
  return {
    cookie: rawCookies,
  };
}
