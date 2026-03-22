import type { ExperienceRendererKey, LanguageCode } from "@commerce/shared-types";
import type { RouteKind } from "../page-data/routing/route-rule.types";
import type {
  CheckoutExperiencePreference,
  ExperienceFunnelMode,
} from "./marketing-directive.types";

export type ExperienceRouteKind = Exclude<RouteKind, "unknown"> | "*";

export const MOCK_CUSTOMER_PROFILES = [
  "guest",
  "first-time",
  "returning",
  "vip",
] as const;

export const MOCK_CAMPAIGN_KEYS = [
  "default",
  "paid-social-discovery",
  "email-reorder",
  "vip-reengagement",
] as const;

export type MockCustomerProfile = (typeof MOCK_CUSTOMER_PROFILES)[number];
export type MockCampaignKey = (typeof MOCK_CAMPAIGN_KEYS)[number];

export type ExperienceSignalSource =
  | "default"
  | "mock-query"
  | "marketing-provider";

export type ResolvedExperienceSignals = {
  customerProfile: MockCustomerProfile;
  campaignKey: MockCampaignKey;
  isReturningCustomer: boolean;
  funnelMode: ExperienceFunnelMode;
  heroOverride?: ExperienceHomeHero;
  promotedCategories: string[];
  promotedProducts: string[];
  audienceTags: string[];
  checkoutPreference: CheckoutExperiencePreference;
  slotFlagsByRenderer: Partial<
    Record<ExperienceRendererKey, Record<string, boolean>>
  >;
  activeMarketingDirectiveIds: string[];
  sources: ExperienceSignalSource[];
};

export type ExperienceSlotRule = {
  rendererKey: ExperienceRendererKey;
  include?: boolean;
  variantKey?: string;
  layoutKey?: string;
  density?: "compact" | "comfortable";
  flags?: Record<string, boolean>;
};

export type ExperienceHomeHero = {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type ExperienceProfile = {
  id: string;
  storeKey: string | "*";
  routeKind: ExperienceRouteKind;
  locale: string | "*";
  customerProfile?: MockCustomerProfile | "*";
  campaignKey?: MockCampaignKey | "*";
  layoutKey: string;
  slotRules: ExperienceSlotRule[];
  homeHero?: ExperienceHomeHero;
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
  signals: ResolvedExperienceSignals;
  homeHero?: ExperienceHomeHero;
};
