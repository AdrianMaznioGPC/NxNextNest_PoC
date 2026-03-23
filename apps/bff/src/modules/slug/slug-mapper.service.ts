import type { LanguageCode, LocaleContext } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import {
  categorySlugCatalog,
  defaultLocaleContext,
  domainConfig,
  localeByLanguage,
  normalizeLanguage,
  pageSlugCatalog,
  productSlugCatalog,
  resolveCatalogLocale,
  staticRouteSegmentCatalog,
  supportedLanguageCodes,
} from "../../adapters/mock/mock-data";
import type { ResolvedIncomingRoute, StaticRouteSegments } from "./slug.types";

@Injectable()
export class SlugMapperService {
  private readonly defaultLocale = defaultLocaleContext.locale;

  constructor() {
    this.assertUniqueSlugs(productSlugCatalog, "product");
    this.assertUniqueSlugs(pageSlugCatalog, "page");
    this.assertUniqueSlugs(categorySlugCatalog, "category");
  }

  getDefaultLocale(): string {
    return this.defaultLocale;
  }

  getSupportedLocale(locale: string): string {
    const direct = resolveCatalogLocale(locale);
    if (staticRouteSegmentCatalog[direct]) return direct;
    const language = normalizeLanguage(locale);
    if (language && localeByLanguage[language]) {
      return localeByLanguage[language];
    }
    return this.defaultLocale;
  }

  getStaticSegments(locale: string): StaticRouteSegments {
    const supported = this.getSupportedLocale(locale);
    const segments =
      staticRouteSegmentCatalog[supported] ??
      staticRouteSegmentCatalog[this.defaultLocale];
    if (!segments) {
      throw new Error("Missing static route segment catalog configuration");
    }
    return segments;
  }

  buildSearchPath(locale: string): string {
    return `/${this.getStaticSegments(locale).search}`;
  }

  buildCategoryListPath(locale: string): string {
    return `/${this.getStaticSegments(locale).categories}`;
  }

  buildCartPath(locale: string): string {
    return `/${this.getStaticSegments(locale).cart}`;
  }

  buildCheckoutPath(locale: string): string {
    return `/${this.getStaticSegments(locale).checkout}`;
  }

  buildProductPath(locale: string, productHandle: string): string {
    const segment = this.getStaticSegments(locale).product;
    const slug = this.getLocalizedSlug(
      productSlugCatalog,
      locale,
      productHandle,
    );
    return `/${segment}/${slug}`;
  }

  buildPagePath(locale: string, pageHandle: string): string {
    const slug = this.getLocalizedSlug(pageSlugCatalog, locale, pageHandle);
    return `/${slug}`;
  }

  buildCategoryPath(locale: string, categoryKey: string): string {
    const segment = this.getStaticSegments(locale).categories;
    const normalized = normalizeCategoryKey(categoryKey);
    const slugPath = this.getLocalizedSlug(
      categorySlugCatalog,
      locale,
      normalized,
    );
    return `/${segment}/${slugPath}`;
  }

  resolveIncomingPath(
    localeContext: LocaleContext,
    requestedPath: string,
  ): ResolvedIncomingRoute {
    const normalizedRequested = normalizePath(requestedPath);
    const { languagePrefix, strippedPath } =
      this.extractLanguagePrefix(normalizedRequested);
    const { defaultLanguage, supportedLanguages } =
      this.getDomainLanguageConfig(localeContext.domain);
    const requestedLanguage =
      languagePrefix ??
      normalizeLanguage(localeContext.language) ??
      normalizeLanguage(localeContext.locale) ??
      defaultLanguage;
    const language = supportedLanguages.includes(requestedLanguage)
      ? requestedLanguage
      : defaultLanguage;
    const locale = this.getSupportedLocale(language);
    const effectiveLocaleContext: LocaleContext = {
      ...localeContext,
      language,
      locale,
    };

    const resolved = this.resolveIncomingPathByLocale(
      effectiveLocaleContext,
      strippedPath,
    );
    return {
      ...resolved,
      requestedPath: normalizedRequested,
      resolvedPath: this.withLanguagePrefix(
        resolved.resolvedPath,
        effectiveLocaleContext,
      ),
    };
  }

  localizePathFromCanonical(
    canonicalPath: string,
    targetLocaleContext: LocaleContext,
  ): string {
    const parsed = this.resolveIncomingPathByLocale(
      { ...targetLocaleContext, locale: this.defaultLocale },
      canonicalPath,
    );

    if (parsed.kind === "unknown") {
      return this.withLanguagePrefix(
        normalizePath(canonicalPath),
        targetLocaleContext,
      );
    }

    return this.withLanguagePrefix(
      this.buildPreferredPath(targetLocaleContext.locale, parsed),
      targetLocaleContext,
    );
  }

  buildAlternatesFromCanonicalPath(
    canonicalPath: string,
  ): Record<string, string> {
    const alternates: Record<string, string> = {};

    for (const item of domainConfig.domains) {
      const supportedLanguages = item.supportedLanguages.length
        ? item.supportedLanguages
        : [item.defaultLanguage];
      for (const language of supportedLanguages) {
        const localeContext: LocaleContext = {
          ...item,
          language,
          locale: this.getSupportedLocale(language),
          region: item.regionCode || item.region,
        };
        const localizedPath = this.localizePathFromCanonical(
          canonicalPath,
          localeContext,
        );
        alternates[toAlternateLanguageTag(language, localeContext.region)] =
          `https://${item.host}${localizedPath}`;
      }
    }

    return alternates;
  }

  extractLanguagePrefix(path: string): {
    languagePrefix?: LanguageCode;
    strippedPath: string;
  } {
    const normalized = normalizePath(path);
    const parts = normalized.split("/").filter(Boolean);
    const first = normalizeLanguage(parts[0]);
    if (!first) {
      return { strippedPath: normalized };
    }

    const stripped = `/${parts.slice(1).join("/")}`;
    return {
      languagePrefix: first,
      strippedPath: stripped === "/" ? "/" : normalizePath(stripped),
    };
  }

  withLanguagePrefix(path: string, localeContext: LocaleContext): string {
    const normalized = normalizePath(path);
    const { defaultLanguage } = this.getDomainLanguageConfig(
      localeContext.domain,
    );
    const language =
      normalizeLanguage(localeContext.language) ??
      normalizeLanguage(localeContext.locale) ??
      defaultLanguage;

    if (language === defaultLanguage) {
      return normalized;
    }

    if (normalized === "/") {
      return `/${language}`;
    }

    const trimmed = normalized.startsWith("/")
      ? normalized.slice(1)
      : normalized;
    return `/${language}/${trimmed}`;
  }

  getDomainLanguageConfig(domain?: string): {
    defaultLanguage: LanguageCode;
    supportedLanguages: LanguageCode[];
  } {
    const normalized = (domain ?? "").toLowerCase();
    const alias = domainConfig.aliases?.find(
      (item) => item.host === normalized,
    );
    const canonicalHost = alias?.canonicalHost ?? normalized;
    const match = domainConfig.domains.find(
      (item) => item.host === canonicalHost,
    );
    if (!match) {
      return {
        defaultLanguage: "en",
        supportedLanguages: [...supportedLanguageCodes],
      };
    }

    return {
      defaultLanguage: match.defaultLanguage,
      supportedLanguages: match.supportedLanguages.length
        ? match.supportedLanguages
        : [match.defaultLanguage],
    };
  }

  toCanonicalProductHandle(locale: string, slug: string): string | undefined {
    return this.toCanonicalKey(productSlugCatalog, locale, slug);
  }

  toCanonicalPageHandle(locale: string, slug: string): string | undefined {
    return this.toCanonicalKey(pageSlugCatalog, locale, slug);
  }

  toCanonicalCategoryKey(locale: string, slugPath: string): string | undefined {
    const normalized = normalizeCategoryKey(slugPath);
    return this.toCanonicalKey(categorySlugCatalog, locale, normalized);
  }

  private resolveIncomingPathByLocale(
    localeContext: LocaleContext,
    requestedPath: string,
  ): ResolvedIncomingRoute {
    const normalized = normalizePath(requestedPath);
    const segments = normalized.split("/").filter(Boolean);
    const locale = this.getSupportedLocale(localeContext.locale);
    const localizedStatic = this.getStaticSegments(locale);
    const canonicalStatic = this.getStaticSegments(this.defaultLocale);

    if (normalized === "/") {
      return {
        kind: "home",
        requestedPath: normalized,
        resolvedPath: "/",
        canonicalPath: "/",
        status: 200,
        localeContext,
      };
    }

    if (
      segments.length === 1 &&
      (segments[0] === localizedStatic.search ||
        segments[0] === canonicalStatic.search)
    ) {
      const canonicalPath = this.buildSearchPath(this.defaultLocale);
      return {
        kind: "search",
        requestedPath: normalized,
        resolvedPath: this.buildSearchPath(locale),
        canonicalPath,
        status: 200,
        localeContext,
      };
    }

    if (
      segments.length === 1 &&
      (segments[0] === localizedStatic.cart ||
        segments[0] === canonicalStatic.cart)
    ) {
      const canonicalPath = this.buildCartPath(this.defaultLocale);
      return {
        kind: "cart",
        requestedPath: normalized,
        resolvedPath: this.buildCartPath(locale),
        canonicalPath,
        status: 200,
        localeContext,
      };
    }

    if (
      segments.length === 1 &&
      (segments[0] === localizedStatic.checkout ||
        segments[0] === canonicalStatic.checkout)
    ) {
      const canonicalPath = this.buildCheckoutPath(this.defaultLocale);
      return {
        kind: "checkout",
        requestedPath: normalized,
        resolvedPath: this.buildCheckoutPath(locale),
        canonicalPath,
        status: 200,
        localeContext,
      };
    }

    const isProductRoute =
      segments[0] === localizedStatic.product ||
      segments[0] === canonicalStatic.product;
    if (isProductRoute && segments.length === 2) {
      const slug = segments[1] ?? "";
      const canonicalHandle = this.toCanonicalProductHandle(locale, slug);
      if (!canonicalHandle) {
        return this.notFound(localeContext, normalized);
      }

      return {
        kind: "product-detail",
        requestedPath: normalized,
        resolvedPath: this.buildProductPath(locale, canonicalHandle),
        canonicalPath: this.buildProductPath(
          this.defaultLocale,
          canonicalHandle,
        ),
        status: 200,
        localeContext,
        productHandle: canonicalHandle,
      };
    }

    const isCategoriesRoute =
      segments[0] === localizedStatic.categories ||
      segments[0] === canonicalStatic.categories;
    if (isCategoriesRoute && segments.length === 1) {
      return {
        kind: "category-list",
        requestedPath: normalized,
        resolvedPath: this.buildCategoryListPath(locale),
        canonicalPath: this.buildCategoryListPath(this.defaultLocale),
        status: 200,
        localeContext,
      };
    }

    if (isCategoriesRoute && segments.length > 1) {
      const slugPath = segments.slice(1).join("/");
      const categoryKey = this.toCanonicalCategoryKey(locale, slugPath);
      if (!categoryKey) {
        return this.notFound(localeContext, normalized);
      }

      return {
        kind: "category-detail",
        requestedPath: normalized,
        resolvedPath: this.buildCategoryPath(locale, categoryKey),
        canonicalPath: this.buildCategoryPath(this.defaultLocale, categoryKey),
        status: 200,
        localeContext,
        categoryKey,
      };
    }

    if (segments.length === 1) {
      const canonicalHandle = this.toCanonicalPageHandle(
        locale,
        segments[0] ?? "",
      );
      if (!canonicalHandle) {
        return this.notFound(localeContext, normalized);
      }

      return {
        kind: "content-page",
        requestedPath: normalized,
        resolvedPath: this.buildPagePath(locale, canonicalHandle),
        canonicalPath: this.buildPagePath(this.defaultLocale, canonicalHandle),
        status: 200,
        localeContext,
        pageHandle: canonicalHandle,
      };
    }

    return this.notFound(localeContext, normalized);
  }

  private buildPreferredPath(
    locale: string,
    route: ResolvedIncomingRoute,
  ): string {
    switch (route.kind) {
      case "home":
        return "/";
      case "search":
        return this.buildSearchPath(locale);
      case "cart":
        return this.buildCartPath(locale);
      case "checkout":
        return this.buildCheckoutPath(locale);
      case "category-list":
        return this.buildCategoryListPath(locale);
      case "category-detail":
        return route.categoryKey
          ? this.buildCategoryPath(locale, route.categoryKey)
          : route.resolvedPath;
      case "product-detail":
        return route.productHandle
          ? this.buildProductPath(locale, route.productHandle)
          : route.resolvedPath;
      case "content-page":
        return route.pageHandle
          ? this.buildPagePath(locale, route.pageHandle)
          : route.resolvedPath;
      default:
        return route.resolvedPath;
    }
  }

  private notFound(
    localeContext: LocaleContext,
    requestedPath: string,
  ): ResolvedIncomingRoute {
    return {
      kind: "unknown",
      requestedPath,
      resolvedPath: requestedPath,
      canonicalPath: requestedPath,
      status: 404,
      localeContext,
    };
  }

  private toCanonicalKey(
    catalog: Record<string, Record<string, string>>,
    locale: string,
    slug: string,
  ): string | undefined {
    const localizedReverse = this.buildReverseMap(
      catalog[this.getSupportedLocale(locale)],
    );
    const canonicalReverse = this.buildReverseMap(catalog[this.defaultLocale]);
    const normalized = slug.trim().toLowerCase();

    const fromLocale = localizedReverse[normalized];
    if (fromLocale) return fromLocale;

    const fromCanonical = canonicalReverse[normalized];
    if (fromCanonical) return fromCanonical;

    if (catalog[this.defaultLocale]?.[normalized]) {
      return normalized;
    }

    if (catalog[this.defaultLocale]?.[normalizeCategoryKey(normalized)]) {
      return normalizeCategoryKey(normalized);
    }

    return undefined;
  }

  private getLocalizedSlug(
    catalog: Record<string, Record<string, string>>,
    locale: string,
    canonicalKey: string,
  ): string {
    const supported = this.getSupportedLocale(locale);
    const normalizedKey = normalizeCategoryKey(canonicalKey);

    return (
      catalog[supported]?.[normalizedKey] ??
      catalog[this.defaultLocale]?.[normalizedKey] ??
      normalizedKey
    );
  }

  private buildReverseMap(input: Record<string, string> = {}) {
    const reverse: Record<string, string> = {};
    for (const [canonicalKey, localized] of Object.entries(input)) {
      reverse[localized.toLowerCase()] = canonicalKey;
    }
    return reverse;
  }

  private assertUniqueSlugs(
    catalog: Record<string, Record<string, string>>,
    label: string,
  ) {
    for (const [locale, mapping] of Object.entries(catalog)) {
      const seen = new Set<string>();
      for (const value of Object.values(mapping)) {
        const slug = value.toLowerCase();
        if (seen.has(slug)) {
          throw new Error(
            `Duplicate ${label} slug \"${slug}\" detected for locale \"${locale}\"`,
          );
        }
        seen.add(slug);
      }
    }
  }
}

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.replace(/\/+$/, "") || "/";
}

function toAlternateLanguageTag(
  language: LanguageCode,
  region: string,
): string {
  return `${language}-${region.toUpperCase()}`;
}

function normalizeCategoryKey(value: string): string {
  return value
    .split("/")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .join("/");
}
