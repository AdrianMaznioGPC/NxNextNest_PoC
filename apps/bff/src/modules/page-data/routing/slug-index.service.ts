import type { LanguageCode, LocaleContext } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import {
  I18N_CONFIG_PORT,
  type I18nConfigPort,
} from "../../../ports/i18n-config.port";
import type { StaticRouteSegments } from "../../../ports/slug-catalog.port";
import {
  SLUG_CATALOG_PORT,
  type SlugCatalogPort,
} from "../../../ports/slug-catalog.port";
import { SlugMapperService } from "../../slug/slug-mapper.service";

@Injectable()
export class SlugIndexService {
  private readonly defaultLocale: string;
  private readonly productSlugIndex: Record<string, Record<string, string>>;
  private readonly pageSlugIndex: Record<string, Record<string, string>>;
  private readonly categoryPathIndex: Record<string, Record<string, string>>;

  constructor(
    private readonly slugMapper: SlugMapperService,
    @Inject(I18N_CONFIG_PORT) private readonly i18nConfig: I18nConfigPort,
    @Inject(SLUG_CATALOG_PORT) private readonly slugCatalog: SlugCatalogPort,
  ) {
    this.defaultLocale = this.i18nConfig.getDefaultLocaleContext().locale;
    this.validateStaticSegments();
    this.validateRouteAmbiguity();
    this.productSlugIndex = this.buildReverseIndex(
      this.slugCatalog.getProductSlugCatalog(),
      "product",
    );
    this.pageSlugIndex = this.buildReverseIndex(
      this.slugCatalog.getPageSlugCatalog(),
      "page",
    );
    this.categoryPathIndex = this.buildReverseIndex(
      this.slugCatalog.getCategorySlugCatalog(),
      "category",
    );
    deepFreeze(this.productSlugIndex);
    deepFreeze(this.pageSlugIndex);
    deepFreeze(this.categoryPathIndex);
  }

  getDefaultLocale(): string {
    return this.defaultLocale;
  }

  getSupportedLocale(locale: string): string {
    return this.slugMapper.getSupportedLocale(locale);
  }

  withLanguagePrefix(path: string, localeContext: LocaleContext): string {
    return this.slugMapper.withLanguagePrefix(path, localeContext);
  }

  stripLanguagePrefix(path: string): {
    languagePrefix?: LanguageCode;
    strippedPath: string;
  } {
    return this.slugMapper.extractLanguagePrefix(path);
  }

  getDomainLanguageConfig(domain?: string): {
    defaultLanguage: LanguageCode;
    supportedLanguages: LanguageCode[];
  } {
    return this.slugMapper.getDomainLanguageConfig(domain);
  }

  getStaticSegments(locale: string): StaticRouteSegments {
    return this.slugMapper.getStaticSegments(locale);
  }

  buildSearchPath(locale: string): string {
    return this.slugMapper.buildSearchPath(locale);
  }

  buildCategoryListPath(locale: string): string {
    return this.slugMapper.buildCategoryListPath(locale);
  }

  buildCartPath(locale: string): string {
    return this.slugMapper.buildCartPath(locale);
  }

  buildCheckoutPath(locale: string): string {
    return this.slugMapper.buildCheckoutPath(locale);
  }

  buildProductPath(locale: string, canonicalHandle: string): string {
    return this.slugMapper.buildProductPath(locale, canonicalHandle);
  }

  buildCategoryPath(locale: string, canonicalCategoryKey: string): string {
    return this.slugMapper.buildCategoryPath(locale, canonicalCategoryKey);
  }

  buildPagePath(locale: string, canonicalPageHandle: string): string {
    return this.slugMapper.buildPagePath(locale, canonicalPageHandle);
  }

  resolveProductHandle(locale: string, slug: string): string | undefined {
    return this.resolveCanonicalKey(
      this.productSlugIndex,
      this.slugCatalog.getProductSlugCatalog(),
      normalizeSlugValue(slug),
      locale,
    );
  }

  resolvePageHandle(locale: string, slug: string): string | undefined {
    return this.resolveCanonicalKey(
      this.pageSlugIndex,
      this.slugCatalog.getPageSlugCatalog(),
      normalizeSlugValue(slug),
      locale,
    );
  }

  resolveCategoryKey(locale: string, slugPath: string): string | undefined {
    return this.resolveCanonicalKey(
      this.categoryPathIndex,
      this.slugCatalog.getCategorySlugCatalog(),
      normalizeCategoryPath(slugPath),
      locale,
    );
  }

  getHealthSummary() {
    return {
      defaultLocale: this.defaultLocale,
      locales: Object.keys(this.slugCatalog.getStaticRouteSegmentCatalog()),
      productSlugLocales: Object.keys(this.productSlugIndex),
      pageSlugLocales: Object.keys(this.pageSlugIndex),
      categorySlugLocales: Object.keys(this.categoryPathIndex),
    };
  }

  private resolveCanonicalKey(
    reverseIndexes: Record<string, Record<string, string>>,
    catalog: Record<string, Record<string, string>>,
    normalizedInput: string,
    locale: string,
  ): string | undefined {
    const supportedLocale = this.getSupportedLocale(locale);
    const fromLocalized = reverseIndexes[supportedLocale]?.[normalizedInput];
    if (fromLocalized) {
      return fromLocalized;
    }

    const fromDefault = reverseIndexes[this.defaultLocale]?.[normalizedInput];
    if (fromDefault) {
      return fromDefault;
    }

    // Canonical handle/path passed directly.
    if (catalog[this.defaultLocale]?.[normalizedInput]) {
      return normalizedInput;
    }

    return undefined;
  }

  private buildReverseIndex(
    catalog: Record<string, Record<string, string>>,
    label: string,
  ): Record<string, Record<string, string>> {
    const reverseIndex: Record<string, Record<string, string>> = {};

    const segmentCatalog = this.slugCatalog.getStaticRouteSegmentCatalog();
    for (const locale of Object.keys(segmentCatalog)) {
      const mapping = catalog[locale] ?? {};
      const reverse: Record<string, string> = {};

      for (const [canonicalKey, localizedValue] of Object.entries(mapping)) {
        const normalizedLocalized = normalizeSlugValue(localizedValue);
        if (reverse[normalizedLocalized]) {
          throw new Error(
            `Duplicate ${label} slug "${normalizedLocalized}" for locale "${locale}"`,
          );
        }
        reverse[normalizedLocalized] = canonicalKey;
      }

      reverseIndex[locale] = reverse;
    }

    return reverseIndex;
  }

  private validateStaticSegments() {
    const segmentCatalog = this.slugCatalog.getStaticRouteSegmentCatalog();
    for (const [locale, segments] of Object.entries(segmentCatalog)) {
      const values = [
        segments.search,
        segments.product,
        segments.categories,
        segments.cart,
        segments.checkout,
      ].map((segment) => segment.trim().toLowerCase());
      if (new Set(values).size !== values.length) {
        throw new Error(
          `Invalid static route segment config for locale "${locale}"`,
        );
      }
    }
  }

  private validateRouteAmbiguity() {
    const segmentCatalog = this.slugCatalog.getStaticRouteSegmentCatalog();
    const supportedLangs = this.slugCatalog.getSupportedLanguageCodes();
    for (const [locale, pages] of Object.entries(
      this.slugCatalog.getPageSlugCatalog(),
    )) {
      const segments = segmentCatalog[locale];
      if (!segments) continue;
      const reserved = new Set(
        [
          segments.search,
          segments.product,
          segments.categories,
          segments.cart,
          segments.checkout,
          ...supportedLangs,
        ].map((item) => normalizeSlugValue(item)),
      );

      for (const localizedPageSlug of Object.values(pages)) {
        const normalized = normalizeSlugValue(localizedPageSlug);
        if (reserved.has(normalized)) {
          throw new Error(
            `Ambiguous route config: page slug "${normalized}" collides with reserved segment in locale "${locale}"`,
          );
        }
      }
    }
  }
}

function normalizeSlugValue(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeCategoryPath(value: string): string {
  return value
    .split("/")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .join("/");
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) {
      deepFreeze(nested);
    }
  }
  return value;
}
