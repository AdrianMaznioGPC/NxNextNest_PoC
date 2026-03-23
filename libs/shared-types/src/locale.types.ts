import type { StoreContext } from "./store.types";

export type LanguageCode = "en" | "es" | "nl" | "fr";

export type LocaleContext = {
  locale: string;
  language: LanguageCode;
  region: string;
  currency: string;
  market: string;
  domain: string;
};

export type LinkLocalizationAudit = {
  language: LanguageCode;
  defaultLanguage: LanguageCode;
  nonCompliantLinkCount: number;
  normalizedLinkCount?: number;
  samplePaths?: string[];
};

export type I18nMessageDescriptor = {
  namespace: string;
  key: string;
  values?: Record<string, string | number | boolean>;
  fallback?: string;
};

export type DomainConfigEntry = LocaleContext & {
  host: string;
  canonical?: boolean;
  regionCode: string;
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  storeKey: StoreContext["storeKey"];
  experienceProfileId: StoreContext["experienceProfileId"];
  storeFlagIconSrc: StoreContext["storeFlagIconSrc"];
  storeFlagIconLabel: StoreContext["storeFlagIconLabel"];
  themeKey: StoreContext["themeKey"];
  themeRevision: StoreContext["themeRevision"];
  themeTokenPack?: StoreContext["themeTokenPack"];
  cartUxMode: StoreContext["cartUxMode"];
  cartPath: StoreContext["cartPath"];
  openCartOnAdd: StoreContext["openCartOnAdd"];
};

export type DomainConfigAlias = {
  host: string;
  canonicalHost: string;
};

export type DomainConfigModel = {
  version: string;
  updatedAt: string;
  maxAgeSeconds: number;
  defaultDomain: string;
  domains: DomainConfigEntry[];
  aliases?: DomainConfigAlias[];
};

export type I18nMessagesModel = {
  locale: string;
  namespaces: string[];
  messages: Record<string, Record<string, string>>;
  translationVersion: string;
};

export type SwitchUrlRequest = {
  path: string;
  query?: Record<string, string | undefined>;
  sourceHost: string;
  sourceOrigin?: string;
  targetRegion: string;
  targetLanguage: LanguageCode;
};

export type SwitchUrlResponse = {
  targetUrl: string;
  resolved: {
    routeKind?:
      | "home"
      | "search"
      | "category-list"
      | "category-detail"
      | "product-detail"
      | "content-page"
      | "cart"
      | "checkout";
    fallbackApplied: boolean;
    reason?:
      | "translated_slug_missing"
      | "entity_unavailable_in_region"
      | "cart_disabled_in_target_store"
      | "unknown_route"
      | "target_region_unresolved";
  };
};
