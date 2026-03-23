import type { LanguageCode } from "./locale.types";

export type CartUxMode = "drawer" | "page";
export type MerchandisingMode = "discovery" | "conversion" | "clearance";
export type MerchandisingSortSlug =
  | "trending-desc"
  | "price-asc"
  | "price-desc"
  | "latest-desc";

export type StoreContext = {
  storeKey: string;
  experienceProfileId: string;
  storeFlagIconSrc: string;
  storeFlagIconLabel: string;
  themeKey: string;
  themeRevision: string;
  themeTokenPack?: string;
  language: LanguageCode;
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  cartUxMode: CartUxMode;
  cartPath: string;
  openCartOnAdd: boolean;
};
