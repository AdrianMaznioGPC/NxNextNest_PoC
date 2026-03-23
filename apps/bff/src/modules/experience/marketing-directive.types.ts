import type { ExperienceRendererKey } from "@commerce/shared-types";
import type {
  CampaignKey,
  CustomerProfile,
  ExperienceRouteKind,
} from "./experience-profile.types";

export type ExperienceFunnelMode =
  | "default"
  | "discovery"
  | "reengagement"
  | "low-friction";

export type CheckoutExperiencePreference = "default" | "prefer-express";

/** A single block-level override. Targets a CMS block type and merges fields onto it. */
export type BlockOverride = {
  /** The CMS block type to target (e.g., "hero-banner", "featured-products") */
  blockType: string;
  /** Fields to shallow-merge onto the matching raw CMS block */
  fields: Record<string, unknown>;
};

export type MarketingDirective = {
  id: string;
  campaignKey: CampaignKey;
  priority: number;
  storeKeys: string[];
  routeKinds: ExperienceRouteKind[];
  customerProfiles?: Array<CustomerProfile | "*">;
  funnelMode?: ExperienceFunnelMode;
  audienceTags?: string[];
  checkoutPreference?: CheckoutExperiencePreference;
  slotFlags?: Partial<Record<ExperienceRendererKey, Record<string, boolean>>>;
  blockOverrides?: BlockOverride[];
};

export type MarketingDirectiveRequest = {
  storeKey: string;
  routeKind?: string;
  customerProfile: CustomerProfile;
  campaignKey: CampaignKey;
  query?: Record<string, string | undefined>;
  cookieHeader?: string;
};
