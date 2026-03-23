import type {
  LanguageCode,
  MerchandisingMode,
  MerchandisingSortSlug,
  SlotOverlayRule,
} from "@commerce/shared-types";
import type { RouteKind } from "../page-data/routing/route-rule.types";

export type MerchandisingRouteKind = Exclude<RouteKind, "unknown"> | "*";

export type MerchandisingSlotRule = SlotOverlayRule;

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
