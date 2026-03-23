import { Injectable } from "@nestjs/common";
import type {
  ExperienceSlotRule,
  ResolvedExperienceProfile,
} from "./experience-profile.types";

/**
 * Applies slot-level overlays from resolved signals onto the experience profile.
 *
 * This service is a pure data merger — it projects `slotFlagsByRenderer` and
 * `checkoutPreference` from the resolved signals onto concrete slot rules.
 * It does not interpret funnel modes or block types.
 */
@Injectable()
export class MarketingOverlayService {
  apply(profile: ResolvedExperienceProfile): ResolvedExperienceProfile {
    const slotRules = profile.slotRules.map((rule) => ({
      ...rule,
      flags: rule.flags ? { ...rule.flags } : undefined,
    }));

    // Apply slot flags from directives
    for (const [rendererKey, flags] of Object.entries(
      profile.signals.slotFlagsByRenderer,
    )) {
      upsertSlotFlags(
        slotRules,
        rendererKey as ExperienceSlotRule["rendererKey"],
        flags,
      );
    }

    // Apply checkout preference
    if (profile.signals.checkoutPreference === "prefer-express") {
      upsertSlotRule(slotRules, {
        rendererKey: "page.checkout-main",
        variantKey: "express",
      });
      upsertSlotFlags(slotRules, "page.checkout-main", { lowFriction: true });
    }

    return {
      ...profile,
      slotRules,
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
  const existing = rules.find(
    (rule) => rule.rendererKey === nextRule.rendererKey,
  );
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
