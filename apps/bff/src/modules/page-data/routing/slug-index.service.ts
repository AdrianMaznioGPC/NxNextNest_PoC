import { Injectable } from "@nestjs/common";
import {
  categorySlugCatalog,
  defaultLocaleContext,
  pageSlugCatalog,
  productSlugCatalog,
  staticRouteSegmentCatalog,
  supportedLanguageCodes,
} from "../../../adapters/mock/mock-data";
import { SlugMapperService } from "../../slug/slug-mapper.service";
import type { StaticRouteSegments } from "../../slug/slug.types";
import type { LocaleContext } from "@commerce/shared-types";
import type { LanguageCode } from "@commerce/shared-types";

@Injectable()
export class SlugIndexService {
  private readonly defaultLocale = defaultLocaleContext.locale;
  private readonly productSlugIndex: Record<string, Record<string, string>>;
  private readonly pageSlugIndex: Record<string, Record<string, string>>;
  private readonly categoryPathIndex: Record<string, Record<string, string>>;

  constructor(private readonly slugMapper: SlugMapperService) {
    this.validateStaticSegments();
    this.validateRouteAmbiguity();
    this.productSlugIndex = this.buildReverseIndex(productSlugCatalog, "product");
    this.pageSlugIndex = this.buildReverseIndex(pageSlugCatalog, "page");
    this.categoryPathIndex = this.buildReverseIndex(categorySlugCatalog, "category");
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
      productSlugCatalog,
      normalizeSlugValue(slug),
      locale,
    );
  }

  resolvePageHandle(locale: string, slug: string): string | undefined {
    return this.resolveCanonicalKey(
      this.pageSlugIndex,
      pageSlugCatalog,
      normalizeSlugValue(slug),
      locale,
    );
  }

  resolveCategoryKey(locale: string, slugPath: string): string | undefined {
    return this.resolveCanonicalKey(
      this.categoryPathIndex,
      categorySlugCatalog,
      normalizeCategoryPath(slugPath),
      locale,
    );
  }

  getHealthSummary() {
    return {
      defaultLocale: this.defaultLocale,
      locales: Object.keys(staticRouteSegmentCatalog),
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

    for (const locale of Object.keys(staticRouteSegmentCatalog)) {
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
    for (const [locale, segments] of Object.entries(staticRouteSegmentCatalog)) {
      const values = [
        segments.search,
        segments.product,
        segments.categories,
        segments.cart,
      ].map((segment) => segment.trim().toLowerCase());
      if (new Set(values).size !== values.length) {
        throw new Error(
          `Invalid static route segment config for locale "${locale}"`,
        );
      }
    }
  }

  private validateRouteAmbiguity() {
    for (const [locale, pages] of Object.entries(pageSlugCatalog)) {
      const segments = staticRouteSegmentCatalog[locale];
      if (!segments) continue;
      const reserved = new Set(
        [
          segments.search,
          segments.product,
          segments.categories,
          segments.cart,
          ...supportedLanguageCodes,
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
