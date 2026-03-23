import type { LocaleContext, SlotManifest } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { applySlotOverlay } from "../page-data/slot-overlay.utils";
import { ExperienceProfileService } from "./experience-profile.service";
import type { ResolvedExperienceProfile } from "./experience-profile.types";
import { ExperienceSignalsService } from "./experience-signals.service";
import { MarketingOverlayService } from "./marketing-overlay.service";

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

  applyToSlots(
    slots: SlotManifest[],
    profile: ResolvedExperienceProfile,
  ): SlotManifest[] {
    return applySlotOverlay(slots, profile.slotRules, [
      `experience:${profile.experienceProfileId}`,
      `theme:${profile.themeKey}:${profile.themeRevision}`,
      `theme-pack:${profile.themeTokenPack ?? profile.themeKey}`,
      `customer-profile:${profile.signals.customerProfile}`,
      `campaign:${profile.signals.campaignKey}`,
      ...profile.signals.activeMarketingDirectiveIds.map(
        (directiveId) => `marketing:${directiveId}`,
      ),
    ]);
  }
}
