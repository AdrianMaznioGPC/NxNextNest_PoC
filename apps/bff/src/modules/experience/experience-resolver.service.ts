import type { LocaleContext, SlotManifest } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { ExperienceProfileService } from "./experience-profile.service";
import type { ResolvedExperienceProfile } from "./experience-profile.types";

@Injectable()
export class ExperienceResolverService {
  constructor(private readonly profiles: ExperienceProfileService) {}

  resolve(params: {
    localeContext: LocaleContext;
    routeKind?: string;
  }): ResolvedExperienceProfile {
    const storeContext = this.profiles.resolveStoreContext(params.localeContext);
    const profile = this.profiles.resolveProfile({
      storeContext,
      routeKind: params.routeKind,
    });
    const themeBinding = this.profiles.resolveStoreThemeBinding(
      storeContext.storeKey,
      storeContext,
    );

    return {
      ...profile,
      themeKey: themeBinding.themeKey,
      themeRevision: themeBinding.themeRevision,
      themeTokenPack: themeBinding.themeTokenPack,
    };
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
          `experience:${profile.experienceProfileId}`,
          `theme:${profile.themeKey}:${profile.themeRevision}`,
          `theme-pack:${profile.themeTokenPack ?? profile.themeKey}`,
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
