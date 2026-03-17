import type { LocaleContext, StoreContext } from "lib/types";
import { cookies, headers } from "next/headers";

export const DEFAULT_LOCALE_CONTEXT: LocaleContext = {
  locale: "en-US",
  language: "en",
  region: "US",
  currency: "USD",
  market: "US",
  domain: "storefront.example.com",
};

export const DEFAULT_STORE_CONTEXT: StoreContext = {
  storeKey: "store-a",
  experienceProfileId: "exp-store-a-v1",
  storeFlagIconSrc: "/icons/eu.svg",
  storeFlagIconLabel: "Store",
  themeKey: "theme-default",
  themeRevision: "2026-q3-v1",
  themeTokenPack: "theme-default",
  language: "en",
  defaultLanguage: "en",
  supportedLanguages: ["en", "es", "nl", "fr"],
  cartUxMode: "drawer",
  cartPath: "/cart",
  openCartOnAdd: true,
};

export async function getRequestLocaleContext(): Promise<LocaleContext> {
  const requestHeaders = await headers();
  const raw = requestHeaders.get("x-locale-context");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<LocaleContext>;
      if (parsed.locale && parsed.language && parsed.region && parsed.domain) {
        return {
          locale: parsed.locale,
          language: parsed.language,
          region: parsed.region,
          currency: parsed.currency || DEFAULT_LOCALE_CONTEXT.currency,
          market: parsed.market || parsed.region,
          domain: parsed.domain,
        };
      }
    } catch {
      // Ignore malformed header and fall through to defaults.
    }
  }

  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  if (localeCookie) {
    const [languageRaw = "en", region = "US"] = localeCookie.split("-");
    const language = normalizeLanguage(languageRaw) ?? "en";
    return {
      ...DEFAULT_LOCALE_CONTEXT,
      locale: localeCookie,
      language,
      region,
      market: region,
    };
  }

  const host =
    requestHeaders.get("x-request-host") ?? DEFAULT_LOCALE_CONTEXT.domain;
  return {
    ...DEFAULT_LOCALE_CONTEXT,
    domain: host,
  };
}

export async function getRequestPathAndQuery() {
  const requestHeaders = await headers();
  const path = requestHeaders.get("x-request-path") || "/";
  const queryString = requestHeaders.get("x-request-query") || "";
  const query = Object.fromEntries(new URLSearchParams(queryString).entries());

  return { path, query };
}

export async function getRequestStoreContext(): Promise<StoreContext> {
  const requestHeaders = await headers();
  const raw = requestHeaders.get("x-store-context");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<StoreContext>;
      if (
        parsed.storeKey &&
        parsed.experienceProfileId &&
        parsed.themeKey &&
        parsed.themeRevision
      ) {
        return {
          storeKey: parsed.storeKey,
          experienceProfileId: parsed.experienceProfileId,
          storeFlagIconSrc: parsed.storeFlagIconSrc ?? "/icons/eu.svg",
          storeFlagIconLabel: parsed.storeFlagIconLabel ?? "Store",
          themeKey: parsed.themeKey,
          themeRevision: parsed.themeRevision,
          themeTokenPack: parsed.themeTokenPack ?? parsed.themeKey,
          language: parsed.language ?? "en",
          defaultLanguage: parsed.defaultLanguage ?? "en",
          supportedLanguages:
            parsed.supportedLanguages && parsed.supportedLanguages.length > 0
              ? parsed.supportedLanguages
              : ["en", "es", "nl", "fr"],
          cartUxMode: parsed.cartUxMode ?? "drawer",
          cartPath: parsed.cartPath ?? "/cart",
          openCartOnAdd: parsed.openCartOnAdd ?? true,
        };
      }
    } catch {
      // Ignore malformed header and fall through to defaults.
    }
  }

  return DEFAULT_STORE_CONTEXT;
}

function normalizeLanguage(input?: string): LocaleContext["language"] | undefined {
  if (
    input === "en" ||
    input === "es" ||
    input === "nl" ||
    input === "fr"
  ) {
    return input;
  }
  return undefined;
}
