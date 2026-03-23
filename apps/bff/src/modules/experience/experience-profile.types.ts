import type {
  ExperienceRendererKey,
  LanguageCode,
} from "@commerce/shared-types";
import type { RouteKind } from "../page-data/routing/route-rule.types";
import type {
  BlockOverride,
  CheckoutExperiencePreference,
  ExperienceFunnelMode,
} from "./marketing-directive.types";

export type ExperienceRouteKind = Exclude<RouteKind, "unknown"> | "*";

/**
 * Known customer profiles used by the mock directive adapter.
 * Kept for documentation only — the BFF does not validate against this list.
 * Any string is accepted; the directive provider decides what profiles mean.
 */
export const MOCK_CUSTOMER_PROFILES = [
  "guest",
  "first-time",
  "returning",
  "vip",
] as const;

/**
 * Known campaign keys used by the mock directive adapter.
 * Kept for documentation only — the BFF does not validate against this list.
 * Any string is accepted as a campaign key; the directive provider is the
 * source of truth for which campaigns are active.
 */
export const MOCK_CAMPAIGN_KEYS = [
  "default",
  "paid-social-discovery",
  "email-reorder",
  "vip-reengagement",
  "black-friday",
  "summer-sale",
] as const;

/** Any string is a valid customer profile — the directive provider decides what it means. */
export type CustomerProfile = string;

/** Any string is a valid campaign key — the directive provider decides what it means. */
export type CampaignKey = string;

/** Signal source identifier. Not a closed set — adapters may add their own. */
export type ExperienceSignalSource = string;

export type ResolvedExperienceSignals = {
  customerProfile: CustomerProfile;
  campaignKey: CampaignKey;
  funnelMode: ExperienceFunnelMode;
  blockOverrides: BlockOverride[];
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

export type ExperienceProfile = {
  id: string;
  storeKey: string | "*";
  routeKind: ExperienceRouteKind;
  locale: string | "*";
  customerProfile?: CustomerProfile | "*";
  campaignKey?: CampaignKey | "*";
  layoutKey: string;
  slotRules: ExperienceSlotRule[];
  blockOverrides?: BlockOverride[];
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
};
