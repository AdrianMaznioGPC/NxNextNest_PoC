import type { LanguageCode, SlotManifest } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
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
    const selectors: Array<{ storeKey: string | "*"; routeKind: string | "*"; language: LanguageCode | "*" }> = [
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
    const rulesByRenderer = new Map(
      profile.slotRules.map((rule) => [rule.rendererKey, rule]),
    );

    const nextSlots: SlotManifest[] = [];
    for (const slot of slots) {
      const rule = rulesByRenderer.get(slot.rendererKey);
      if (rule?.include === false) {
        continue;
      }

      const presentation = {
        ...slot.presentation,
        variantKey: rule?.variantKey ?? slot.presentation?.variantKey ?? "default",
        layoutKey: rule?.layoutKey ?? slot.presentation?.layoutKey,
        density: rule?.density ?? slot.presentation?.density,
        flags: rule?.flags ?? slot.presentation?.flags,
      };

      const nextSlotRef = slot.slotRef
        ? {
            ...slot.slotRef,
            query: dedupeQuery({
              ...slot.slotRef.query,
              variantKey: presentation.variantKey,
              layoutKey: presentation.layoutKey,
              density: presentation.density,
            }),
          }
        : undefined;

      nextSlots.push({
        ...slot,
        presentation,
        slotRef: nextSlotRef,
        revalidateTags: dedupe([
          ...slot.revalidateTags,
          `merchandising:${profile.profileId}`,
          `merchandising-mode:${profile.mode}`,
        ]),
      });
    }

    return nextSlots;
  }
}

function pickFirstMatchingProfile(
  selectors: Array<{ storeKey: string | "*"; routeKind: string | "*"; language: LanguageCode | "*" }>,
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

function dedupe(values: string[]) {
  return [...new Set(values)];
}

function dedupeQuery(
  input: Record<string, string | undefined>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

