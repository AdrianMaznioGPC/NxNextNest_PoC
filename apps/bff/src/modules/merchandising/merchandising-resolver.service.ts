import type { LanguageCode, SlotManifest } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { applySlotOverlay } from "../page-data/slot-overlay.utils";
import { MERCHANDISING_PROFILES } from "./merchandising-profile.catalog";
import type { ResolvedMerchandisingProfile } from "./merchandising-profile.types";
import { MerchandisingValidatorService } from "./merchandising-validator.service";

@Injectable()
export class MerchandisingResolverService {
  constructor(private readonly validator: MerchandisingValidatorService) {
    this.validator.validateCatalog();
  }

  resolve(params: {
    storeKey: string;
    routeKind?: string;
    language: LanguageCode;
  }): ResolvedMerchandisingProfile {
    const routeKind = params.routeKind ?? "*";
    const selectors: Array<{
      storeKey: string | "*";
      routeKind: string | "*";
      language: LanguageCode | "*";
    }> = [
      {
        storeKey: params.storeKey,
        routeKind,
        language: params.language,
      },
      {
        storeKey: params.storeKey,
        routeKind,
        language: "*",
      },
      {
        storeKey: params.storeKey,
        routeKind: "*",
        language: params.language,
      },
      {
        storeKey: params.storeKey,
        routeKind: "*",
        language: "*",
      },
      {
        storeKey: "*",
        routeKind: "*",
        language: "*",
      },
    ];

    const profile =
      pickFirstMatchingProfile(selectors) ?? MERCHANDISING_PROFILES[0];

    if (!profile) {
      throw new Error("No merchandising profile available");
    }

    return {
      profileId: profile.id,
      mode: profile.mode,
      defaultSortSlug: profile.directives.defaultSortSlug,
      slotRules: profile.directives.slotRules,
    };
  }

  applyDefaultSort(
    query: Record<string, string | undefined>,
    profile: Pick<ResolvedMerchandisingProfile, "defaultSortSlug">,
  ): {
    query: Record<string, string | undefined>;
    defaultSortApplied: boolean;
  } {
    if (query.sort || query.sortKey || !profile.defaultSortSlug) {
      return {
        query,
        defaultSortApplied: false,
      };
    }

    return {
      query: {
        ...query,
        sort: profile.defaultSortSlug,
      },
      defaultSortApplied: true,
    };
  }

  applyToSlots(
    slots: SlotManifest[],
    profile: ResolvedMerchandisingProfile,
  ): SlotManifest[] {
    return applySlotOverlay(slots, profile.slotRules, [
      `merchandising:${profile.profileId}`,
      `merchandising-mode:${profile.mode}`,
    ]);
  }
}

function pickFirstMatchingProfile(
  selectors: Array<{
    storeKey: string | "*";
    routeKind: string | "*";
    language: LanguageCode | "*";
  }>,
) {
  for (const selector of selectors) {
    const match = MERCHANDISING_PROFILES.find(
      (profile) =>
        profile.storeKey === selector.storeKey &&
        profile.routeKind === selector.routeKind &&
        profile.language === selector.language,
    );
    if (match) {
      return match;
    }
  }

  return undefined;
}
