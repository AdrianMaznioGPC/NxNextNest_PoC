import type {
  ExperienceRendererKey,
  LanguageCode,
  MerchandisingMode,
  MerchandisingSortSlug,
} from "@commerce/shared-types";
import type { RouteKind } from "../page-data/routing/route-rule.types";

export type MerchandisingRouteKind = Exclude<RouteKind, "unknown"> | "*";

export type MerchandisingSlotRule = {
  rendererKey: ExperienceRendererKey;
  include?: boolean;
  variantKey?: string;
  layoutKey?: string;
  density?: "compact" | "comfortable";
  flags?: Record<string, boolean>;
};

export type MerchandisingProfile = {
  id: string;
  storeKey: string | "*";
  routeKind: MerchandisingRouteKind;
  language: LanguageCode | "*";
  mode: MerchandisingMode;
  directives: {
    defaultSortSlug?: MerchandisingSortSlug;
    slotRules: MerchandisingSlotRule[];
  };
};

export type ResolvedMerchandisingProfile = {
  profileId: string;
  mode: MerchandisingMode;
  defaultSortSlug?: MerchandisingSortSlug;
  slotRules: MerchandisingSlotRule[];
};
