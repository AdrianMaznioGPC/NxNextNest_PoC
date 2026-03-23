import type { LanguageCode } from "@commerce/shared-types";

/**
 * Static route segment names per locale (e.g. "search" → "buscar" in es-ES).
 */
export type StaticRouteSegments = {
  search: string;
  product: string;
  categories: string;
  cart: string;
  checkout: string;
};

export interface SlugCatalogPort {
  /** Static route segments keyed by locale (e.g. "en-US" → { search: "search", ... }) */
  getStaticRouteSegmentCatalog(): Record<string, StaticRouteSegments>;

  /** Product slug catalog: locale → { canonicalHandle → localizedSlug } */
  getProductSlugCatalog(): Record<string, Record<string, string>>;

  /** Page slug catalog: locale → { canonicalHandle → localizedSlug } */
  getPageSlugCatalog(): Record<string, Record<string, string>>;

  /** Category slug catalog: locale → { canonicalKey → localizedSlugPath } */
  getCategorySlugCatalog(): Record<string, Record<string, string>>;

  /** Map of language code → full locale tag (e.g. "es" → "es-ES") */
  getLocaleByLanguage(): Record<LanguageCode, string>;

  /** All supported language codes */
  getSupportedLanguageCodes(): LanguageCode[];
}

export const SLUG_CATALOG_PORT = Symbol("SLUG_CATALOG_PORT");
