import { Injectable } from "@nestjs/common";
import type {
  ExperienceSlotRule,
  ResolvedExperienceProfile,
} from "./experience-profile.types";

@Injectable()
export class MarketingOverlayService {
  apply(profile: ResolvedExperienceProfile): ResolvedExperienceProfile {
    const slotRules = profile.slotRules.map((rule) => ({
      ...rule,
      flags: rule.flags ? { ...rule.flags } : undefined,
    }));

    if (profile.signals.funnelMode === "discovery") {
      upsertSlotFlags(slotRules, "page.home", { discoveryMode: true });
    }

    if (profile.signals.funnelMode === "reengagement") {
      upsertSlotFlags(slotRules, "page.home", { reengagementMode: true });
    }

    for (const [rendererKey, flags] of Object.entries(
      profile.signals.slotFlagsByRenderer,
    )) {
      upsertSlotFlags(slotRules, rendererKey as ExperienceSlotRule["rendererKey"], flags);
    }

    if (
      profile.signals.checkoutPreference === "prefer-express" &&
      profile.signals.isReturningCustomer
    ) {
      upsertSlotRule(slotRules, {
        rendererKey: "page.checkout-main",
        variantKey: "express",
      });
      upsertSlotFlags(slotRules, "page.checkout-main", { lowFriction: true });
    }

    return {
      ...profile,
      slotRules,
      homeHero: profile.signals.heroOverride ?? profile.homeHero,
    };
  }
}

function upsertSlotFlags(
  rules: ExperienceSlotRule[],
  rendererKey: ExperienceSlotRule["rendererKey"],
  flags: Record<string, boolean>,
) {
  const existing = rules.find((rule) => rule.rendererKey === rendererKey);
  if (existing) {
    existing.flags = {
      ...(existing.flags ?? {}),
      ...flags,
    };
    return;
  }

  rules.push({ rendererKey, flags });
}

function upsertSlotRule(
  rules: ExperienceSlotRule[],
  nextRule: ExperienceSlotRule,
) {
  const existing = rules.find((rule) => rule.rendererKey === nextRule.rendererKey);
  if (!existing) {
    rules.push(nextRule);
    return;
  }

  Object.assign(existing, nextRule, {
    flags: {
      ...(existing.flags ?? {}),
      ...(nextRule.flags ?? {}),
    },
  });
}
