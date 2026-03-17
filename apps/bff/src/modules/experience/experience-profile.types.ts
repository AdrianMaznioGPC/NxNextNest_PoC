import type { RouteKind } from "../page-data/routing/route-rule.types";
import type { LanguageCode } from "@commerce/shared-types";

export type ExperienceRouteKind = Exclude<RouteKind, "unknown"> | "*";

export type ExperienceSlotRule = {
  rendererKey: string;
  include?: boolean;
  variantKey?: string;
  layoutKey?: string;
  density?: "compact" | "comfortable";
  flags?: Record<string, boolean>;
};

export type ExperienceProfile = {
  id: string;
  storeKey: string | "*";
  routeKind: ExperienceRouteKind;
  locale: string | "*";
  layoutKey: string;
  slotRules: ExperienceSlotRule[];
};

export type StoreThemeBinding = {
  storeKey: string;
  themeKey: string;
  themeRevision: string;
  themeTokenPack?: string;
};

export type ExperienceStoreContext = {
  storeKey: string;
  experienceProfileId: string;
  storeFlagIconSrc: string;
  storeFlagIconLabel: string;
  themeKey: string;
  themeRevision: string;
  themeTokenPack?: string;
  language: LanguageCode;
  defaultLanguage: LanguageCode;
  supportedLanguages: Array<LanguageCode>;
  cartUxMode: "drawer" | "page";
  cartPath: string;
  openCartOnAdd: boolean;
};

export type ResolvedExperienceProfile = {
  storeKey: string;
  experienceProfileId: string;
  storeFlagIconSrc: string;
  storeFlagIconLabel: string;
  themeKey: string;
  themeRevision: string;
  themeTokenPack?: string;
  language: LanguageCode;
  defaultLanguage: LanguageCode;
  supportedLanguages: Array<LanguageCode>;
  cartUxMode: "drawer" | "page";
  cartPath: string;
  openCartOnAdd: boolean;
  layoutKey: string;
  slotRules: ExperienceSlotRule[];
};
