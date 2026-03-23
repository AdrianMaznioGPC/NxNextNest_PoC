import type { LocaleContext, SlotManifest } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { ExperienceProfileService } from "./experience-profile.service";
import { ExperienceSignalsService } from "./experience-signals.service";
import { MarketingOverlayService } from "./marketing-overlay.service";
import type { ResolvedExperienceProfile } from "./experience-profile.types";

@Injectable()
export class ExperienceResolverService {
  constructor(
    private readonly profiles: ExperienceProfileService,
    private readonly signals: ExperienceSignalsService,
    private readonly overlay: MarketingOverlayService,
  ) {}

  async resolve(params: {
    localeContext: LocaleContext;
    routeKind?: string;
    query?: Record<string, string | undefined>;
    cookieHeader?: string;
  }): Promise<ResolvedExperienceProfile> {
    const storeContext = this.profiles.resolveStoreContext(
      params.localeContext,
    );
    const resolvedSignals = await this.signals.resolve({
      storeKey: storeContext.storeKey,
      routeKind: params.routeKind,
      query: params.query,
      cookieHeader: params.cookieHeader,
    });
    const profile = this.profiles.resolveProfile({
      storeContext,
      routeKind: params.routeKind,
      signals: resolvedSignals,
    });
    const themeBinding = this.profiles.resolveStoreThemeBinding(
      storeContext.storeKey,
      storeContext,
    );

    return this.overlay.apply({
      ...profile,
      themeKey: themeBinding.themeKey,
      themeRevision: themeBinding.themeRevision,
      themeTokenPack: themeBinding.themeTokenPack,
    });
  }

  applyToSlots(slots: SlotManifest[], profile: ResolvedExperienceProfile) {
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
        variantKey:
          rule?.variantKey ?? slot.presentation?.variantKey ?? "default",
        layoutKey: rule?.layoutKey ?? slot.presentation?.layoutKey,
        density: rule?.density ?? slot.presentation?.density,
        flags: mergeFlags(slot.presentation?.flags, rule?.flags),
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
          `experience:${profile.experienceProfileId}`,
          `theme:${profile.themeKey}:${profile.themeRevision}`,
          `theme-pack:${profile.themeTokenPack ?? profile.themeKey}`,
          `customer-profile:${profile.signals.customerProfile}`,
          `campaign:${profile.signals.campaignKey}`,
          ...profile.signals.activeMarketingDirectiveIds.map(
            (directiveId) => `marketing:${directiveId}`,
          ),
        ]),
        priority: slot.priority,
        stream: slot.stream,
      });
    }

    return nextSlots;
  }
}

function dedupe(values: string[]) {
  return [...new Set(values)];
}

function mergeFlags(
  slotFlags?: Record<string, boolean>,
  ruleFlags?: Record<string, boolean>,
) {
  if (!slotFlags && !ruleFlags) {
    return undefined;
  }

  return {
    ...(slotFlags ?? {}),
    ...(ruleFlags ?? {}),
  };
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
