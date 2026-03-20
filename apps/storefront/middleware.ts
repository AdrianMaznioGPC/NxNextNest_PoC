import type {
  DomainConfigModel,
  LanguageCode,
  LocaleContext,
  StoreContext,
} from "lib/types";
import { NextRequest, NextResponse } from "next/server";

const BFF_URL = process.env.BFF_URL || "http://localhost:4000";
const CONFIG_TTL_MS = Number(
  process.env.DOMAIN_CONFIG_TTL_MS ??
    (process.env.NODE_ENV === "development" ? "0" : "60000"),
);

type DomainConfigCache = {
  value?: DomainConfigModel;
  etag?: string;
  expiresAt: number;
  refreshInFlight?: Promise<void>;
};

const configCache: DomainConfigCache = {
  expiresAt: 0,
};

const SUPPORTED_LANGUAGES: LanguageCode[] = ["en", "es", "nl", "fr"];
const LOCALE_BY_LANGUAGE: Record<LanguageCode, string> = {
  en: "en-US",
  es: "es-ES",
  nl: "nl-NL",
  fr: "fr-FR",
};

const STATIC_SEGMENT_BY_LANGUAGE: Record<LanguageCode, { cart: string }> = {
  en: { cart: "cart" },
  es: { cart: "carrito" },
  nl: { cart: "winkelwagen" },
  fr: { cart: "panier" },
};

export async function middleware(request: NextRequest) {
  const hostHeader =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  const host = normalizeHost(hostHeader);

  // Local development should not hard-redirect to configured production domains.
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    const localPrefix = extractLanguagePrefix(request.nextUrl.pathname);
    const language =
      localPrefix.languagePrefix &&
      SUPPORTED_LANGUAGES.includes(localPrefix.languagePrefix)
        ? localPrefix.languagePrefix
        : "en";
    const localRegion = "US";

    return withLocaleHeaders(
      request,
      {
        locale: localeForLanguage(language),
        language,
        region: localRegion,
        currency: "USD",
        market: localRegion,
        domain: host,
      },
      {
        storeKey: "store-a",
        experienceProfileId: "exp-store-a-v1",
        storeFlagIconSrc: "/icons/eu.svg",
        storeFlagIconLabel: "Store",
        themeKey: "theme-default",
        themeRevision: "2026-q3-v1",
        themeTokenPack: "theme-default",
        language,
        defaultLanguage: "en",
        supportedLanguages: SUPPORTED_LANGUAGES,
        cartUxMode: "drawer",
        cartPath: buildLocalizedCartPath(language, "en"),
        openCartOnAdd: true,
      },
      localPrefix.strippedPath,
      localPrefix.languagePrefix ? "prefix" : "default",
    );
  }

  const config = await getDomainConfig();
  const resolved = resolveDomainLocale(host, config);

  if (!resolved) {
    const fallback = config.domains.find(
      (item) => item.host === config.defaultDomain,
    );
    if (!fallback) {
      return NextResponse.next();
    }
    return redirectToHost(request, fallback.host);
  }

  if (resolved.redirectHost && resolved.redirectHost !== host) {
    return redirectToHost(request, resolved.redirectHost);
  }
  const { languagePrefix, strippedPath } = extractLanguagePrefix(
    request.nextUrl.pathname,
  );
  const language =
    languagePrefix &&
    resolved.storeContext.supportedLanguages.includes(languagePrefix)
      ? languagePrefix
      : resolved.storeContext.defaultLanguage;
  const languageSource = languagePrefix ? "prefix" : "default";

  const localeContext: LocaleContext = {
    ...resolved.localeContext,
    locale: localeForLanguage(language),
    language,
  };
  const storeContext: StoreContext = {
    ...resolved.storeContext,
    language,
    cartPath: buildLocalizedCartPath(
      language,
      resolved.storeContext.defaultLanguage,
    ),
  };

  if (
    languagePrefix &&
    languagePrefix === resolved.storeContext.defaultLanguage
  ) {
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;
    return NextResponse.redirect(url, 301);
  }

  return withLocaleHeaders(
    request,
    localeContext,
    storeContext,
    strippedPath,
    languageSource,
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

function withLocaleHeaders(
  request: NextRequest,
  localeContext: LocaleContext,
  storeContext: StoreContext,
  strippedPath: string,
  languageSource: "prefix" | "default",
) {
  const headers = new Headers(request.headers);
  headers.set("x-locale-context", JSON.stringify(localeContext));
  headers.set("x-store-context", JSON.stringify(storeContext));
  headers.set("x-request-path", strippedPath);
  headers.set("x-request-query", request.nextUrl.searchParams.toString());
  headers.set("x-request-host", localeContext.domain);
  headers.set("x-language-source", languageSource);

  const response = NextResponse.next({
    request: {
      headers,
    },
  });

  response.cookies.set("locale", localeContext.locale, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    secure: request.nextUrl.protocol === "https:",
  });
  response.headers.set("X-Language-Source", languageSource);

  return response;
}

function redirectToHost(request: NextRequest, host: string) {
  const url = request.nextUrl.clone();
  // Preserve current port (e.g. :3000 in local dev) while switching hostname.
  url.hostname = normalizeHost(host);
  return NextResponse.redirect(url, 301);
}

async function getDomainConfig() {
  const now = Date.now();

  if (configCache.value && configCache.expiresAt > now) {
    return configCache.value;
  }

  if (configCache.refreshInFlight) {
    await configCache.refreshInFlight;
    if (configCache.value) return configCache.value;
  } else {
    configCache.refreshInFlight = refreshDomainConfig().finally(() => {
      configCache.refreshInFlight = undefined;
    });
    await configCache.refreshInFlight;
    if (configCache.value) return configCache.value;
  }

  return {
    version: "fallback",
    updatedAt: new Date().toISOString(),
    maxAgeSeconds: 60,
    defaultDomain: "winparts.ie.localhost",
    domains: [
      {
        host: "winparts.ie.localhost",
        locale: "en-US",
        language: "en",
        region: "US",
        regionCode: "US",
        defaultLanguage: "en",
        supportedLanguages: SUPPORTED_LANGUAGES,
        currency: "USD",
        market: "US",
        domain: "winparts.ie.localhost",
        canonical: true,
        storeKey: "store-a",
        experienceProfileId: "exp-store-a-v1",
        storeFlagIconSrc: "/icons/eu.svg",
        storeFlagIconLabel: "Store",
        themeKey: "theme-default",
        themeRevision: "2026-q3-v1",
        themeTokenPack: "theme-default",
        cartUxMode: "drawer",
        cartPath: "/cart",
        openCartOnAdd: true,
      },
    ],
  } satisfies DomainConfigModel;
}

async function refreshDomainConfig() {
  const headers: Record<string, string> = {};
  if (configCache.etag) {
    headers["If-None-Match"] = configCache.etag;
  }

  const response = await fetch(`${BFF_URL}/i18n/domain-config`, {
    headers,
  });

  if (response.status === 304 && configCache.value) {
    configCache.expiresAt = Date.now() + CONFIG_TTL_MS;
    return;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch domain config: ${response.status}`);
  }

  const value = (await response.json()) as DomainConfigModel;
  configCache.value = value;
  configCache.etag = response.headers.get("etag") ?? undefined;
  configCache.expiresAt = Date.now() + CONFIG_TTL_MS;
}

function resolveDomainLocale(host: string, config: DomainConfigModel) {
  const normalizedHost = normalizeHost(host);
  const alias = config.aliases?.find(
    (item) => normalizeHost(item.host) === normalizedHost,
  );
  const canonicalHost = alias?.canonicalHost ?? normalizedHost;
  const matched = config.domains.find((item) => item.host === canonicalHost);
  if (!matched) return undefined;

  return {
    localeContext: {
      locale: matched.locale,
      language: matched.language,
      region: matched.regionCode || matched.region,
      currency: matched.currency,
      market: matched.market,
      domain: matched.domain,
    } satisfies LocaleContext,
    storeContext: {
      storeKey: matched.storeKey,
      experienceProfileId: matched.experienceProfileId,
      storeFlagIconSrc: matched.storeFlagIconSrc,
      storeFlagIconLabel: matched.storeFlagIconLabel,
      themeKey: matched.themeKey,
      themeRevision: matched.themeRevision,
      themeTokenPack: matched.themeTokenPack ?? matched.themeKey,
      language: matched.language,
      defaultLanguage: matched.defaultLanguage,
      supportedLanguages:
        matched.supportedLanguages.length > 0
          ? matched.supportedLanguages
          : [matched.defaultLanguage],
      cartUxMode: matched.cartUxMode,
      cartPath: matched.cartPath,
      openCartOnAdd: matched.openCartOnAdd,
    },
    redirectHost: canonicalHost,
  };
}

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0] || "";
}

function localeForLanguage(language: LanguageCode) {
  return LOCALE_BY_LANGUAGE[language];
}

function normalizeLanguage(value?: string): LanguageCode | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().split("-")[0];
  if (
    normalized === "en" ||
    normalized === "es" ||
    normalized === "nl" ||
    normalized === "fr"
  ) {
    return normalized;
  }
  return undefined;
}

function extractLanguagePrefix(pathname: string): {
  languagePrefix?: LanguageCode;
  strippedPath: string;
} {
  const normalized = pathname || "/";
  const parts = normalized.split("/").filter(Boolean);
  const first = normalizeLanguage(parts[0]);
  if (!first) {
    return { strippedPath: normalized || "/" };
  }

  const stripped = `/${parts.slice(1).join("/")}`;
  return {
    languagePrefix: first,
    strippedPath: stripped === "/" ? "/" : stripped,
  };
}

function buildLocalizedCartPath(
  language: LanguageCode,
  defaultLanguage: LanguageCode,
) {
  const segment = STATIC_SEGMENT_BY_LANGUAGE[language].cart;
  if (language === defaultLanguage) {
    return `/${segment}`;
  }
  return `/${language}/${segment}`;
}
