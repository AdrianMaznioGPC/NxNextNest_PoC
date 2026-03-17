import { Injectable } from "@nestjs/common";
import { EXPERIENCE_RENDERER_VARIANTS } from "../experience/experience-profile.catalog";
import {
  ALLOWED_MERCHANDISING_SORT_SLUGS,
  MERCHANDISING_PROFILES,
} from "./merchandising-profile.catalog";

@Injectable()
export class MerchandisingValidatorService {
  validateCatalog() {
    const hasGlobalDefault = MERCHANDISING_PROFILES.some(
      (profile) =>
        profile.storeKey === "*" &&
        profile.routeKind === "*" &&
        profile.language === "*",
    );

    if (!hasGlobalDefault) {
      throw new Error("Missing global default merchandising profile");
    }

    const seenSelectors = new Set<string>();
    for (const profile of MERCHANDISING_PROFILES) {
      const selectorKey = `${profile.storeKey}:${profile.routeKind}:${profile.language}`;
      if (seenSelectors.has(selectorKey)) {
        throw new Error(
          `Duplicate merchandising profile selector "${selectorKey}"`,
        );
      }
      seenSelectors.add(selectorKey);

      if (
        profile.directives.defaultSortSlug &&
        !ALLOWED_MERCHANDISING_SORT_SLUGS.includes(
          profile.directives
            .defaultSortSlug as (typeof ALLOWED_MERCHANDISING_SORT_SLUGS)[number],
        )
      ) {
        throw new Error(
          `Invalid default sort slug "${profile.directives.defaultSortSlug}" in profile "${profile.id}"`,
        );
      }

      const seenRenderers = new Set<string>();
      for (const rule of profile.directives.slotRules) {
        if (seenRenderers.has(rule.rendererKey)) {
          throw new Error(
            `Duplicate merchandising slot rule for renderer "${rule.rendererKey}" in profile "${profile.id}"`,
          );
        }
        seenRenderers.add(rule.rendererKey);

        const variants = EXPERIENCE_RENDERER_VARIANTS[rule.rendererKey];
        if (!variants) {
          throw new Error(
            `Unknown renderer key "${rule.rendererKey}" in merchandising profile "${profile.id}"`,
          );
        }

        if (rule.variantKey && !variants.includes(rule.variantKey)) {
          throw new Error(
            `Unknown variant "${rule.variantKey}" for renderer "${rule.rendererKey}" in merchandising profile "${profile.id}"`,
          );
        }
      }
    }
  }
}

