import type { ExperienceRendererKey } from "@commerce/shared-types";
import type {
  ExperienceHomeHero,
  ExperienceRouteKind,
  MockCampaignKey,
  MockCustomerProfile,
} from "./experience-profile.types";

export type ExperienceFunnelMode =
  | "default"
  | "discovery"
  | "reengagement"
  | "low-friction";

export type CheckoutExperiencePreference = "default" | "prefer-express";

export type MarketingDirective = {
  id: string;
  campaignKey: MockCampaignKey;
  priority: number;
  storeKeys: string[];
  routeKinds: ExperienceRouteKind[];
  customerProfiles?: Array<MockCustomerProfile | "*">;
  funnelMode?: ExperienceFunnelMode;
  heroOverride?: ExperienceHomeHero;
  promotedCategories?: string[];
  promotedProducts?: string[];
  audienceTags?: string[];
  checkoutPreference?: CheckoutExperiencePreference;
  slotFlags?: Partial<Record<ExperienceRendererKey, Record<string, boolean>>>;
};

export type MarketingDirectiveRequest = {
  storeKey: string;
  routeKind?: string;
  customerProfile: MockCustomerProfile;
  campaignKey: MockCampaignKey;
  query?: Record<string, string | undefined>;
  cookieHeader?: string;
};
