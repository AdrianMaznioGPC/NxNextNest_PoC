import type { DomainConfigModel } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import {
  ALLOWED_THEME_KEYS,
  EXPERIENCE_PROFILES,
  EXPERIENCE_RENDERER_VARIANTS,
} from "./experience-profile.catalog";
import {
  MOCK_CAMPAIGN_KEYS,
  MOCK_CUSTOMER_PROFILES,
} from "./experience-profile.types";
const ALLOWED_CART_UX_MODES = ["drawer", "page"] as const;
const ALLOWED_LANGUAGES = ["en", "es", "nl", "fr"] as const;

@Injectable()
export class ExperienceValidatorService {
  validateCatalog() {
    const hasGlobalDefault = EXPERIENCE_PROFILES.some(
      (profile) =>
        profile.storeKey === "*" &&
        profile.routeKind === "*" &&
        profile.locale === "*" &&
        (profile.customerProfile ?? "*") === "*" &&
        (profile.campaignKey ?? "*") === "*",
    );
    if (!hasGlobalDefault) {
      throw new Error("Missing global default experience profile");
    }

    const profileKeys = new Set<string>();
    for (const profile of EXPERIENCE_PROFILES) {
      const key = [
        profile.storeKey,
        profile.routeKind,
        profile.locale,
        profile.customerProfile ?? "*",
        profile.campaignKey ?? "*",
      ].join(":");
      if (profileKeys.has(key)) {
        throw new Error(`Duplicate experience profile selector "${key}"`);
      }
      profileKeys.add(key);

      if (
        profile.customerProfile &&
        profile.customerProfile !== "*" &&
        !MOCK_CUSTOMER_PROFILES.includes(profile.customerProfile)
      ) {
        throw new Error(
          `Unknown customerProfile "${profile.customerProfile}" in profile "${profile.id}"`,
        );
      }

      if (
        profile.campaignKey &&
        profile.campaignKey !== "*" &&
        !MOCK_CAMPAIGN_KEYS.includes(profile.campaignKey)
      ) {
        throw new Error(
          `Unknown campaignKey "${profile.campaignKey}" in profile "${profile.id}"`,
        );
      }

      const seenRendererRules = new Set<string>();
      for (const rule of profile.slotRules) {
        if (seenRendererRules.has(rule.rendererKey)) {
          throw new Error(
            `Duplicate slot rule for renderer "${rule.rendererKey}" in profile "${profile.id}"`,
          );
        }
        seenRendererRules.add(rule.rendererKey);

        const supportedVariants = EXPERIENCE_RENDERER_VARIANTS[rule.rendererKey];
        if (!supportedVariants) {
          throw new Error(
            `Unknown renderer key "${rule.rendererKey}" in profile "${profile.id}"`,
          );
        }

        if (rule.variantKey && !supportedVariants.includes(rule.variantKey)) {
          throw new Error(
            `Unknown variant "${rule.variantKey}" for renderer "${rule.rendererKey}" in profile "${profile.id}"`,
          );
        }
      }
    }
  }

  validateDomainBindings(config: DomainConfigModel) {
    const byStore = new Map<
      string,
      {
        storeFlagIconSrc: string;
        storeFlagIconLabel: string;
        themeKey: string;
        themeRevision: string;
        themeTokenPack: string;
        cartUxMode: "drawer" | "page";
        openCartOnAdd: boolean;
      }
    >();

    for (const domain of config.domains) {
      if (!domain.regionCode || !domain.regionCode.trim()) {
        throw new Error(
          `Missing regionCode for store "${domain.storeKey}"`,
        );
      }

      if (!domain.storeFlagIconSrc || !domain.storeFlagIconSrc.trim()) {
        throw new Error(
          `Missing storeFlagIconSrc for store "${domain.storeKey}"`,
        );
      }

      if (!domain.storeFlagIconSrc.startsWith("/icons/")) {
        throw new Error(
          `Invalid storeFlagIconSrc "${domain.storeFlagIconSrc}" for store "${domain.storeKey}"`,
        );
      }

      if (!domain.storeFlagIconSrc.endsWith(".svg")) {
        throw new Error(
          `storeFlagIconSrc must be an SVG path for store "${domain.storeKey}"`,
        );
      }

      if (!domain.storeFlagIconLabel || !domain.storeFlagIconLabel.trim()) {
        throw new Error(
          `Missing storeFlagIconLabel for store "${domain.storeKey}"`,
        );
      }

      if (
        !ALLOWED_LANGUAGES.includes(
          domain.defaultLanguage as (typeof ALLOWED_LANGUAGES)[number],
        )
      ) {
        throw new Error(
          `Invalid default language "${domain.defaultLanguage}" for store "${domain.storeKey}"`,
        );
      }

      if (!domain.supportedLanguages.length) {
        throw new Error(
          `supportedLanguages must not be empty for store "${domain.storeKey}"`,
        );
      }

      for (const language of domain.supportedLanguages) {
        if (
          !ALLOWED_LANGUAGES.includes(
            language as (typeof ALLOWED_LANGUAGES)[number],
          )
        ) {
          throw new Error(
            `Unsupported language "${language}" for store "${domain.storeKey}"`,
          );
        }
      }

      if (!domain.supportedLanguages.includes(domain.defaultLanguage)) {
        throw new Error(
          `defaultLanguage "${domain.defaultLanguage}" must be present in supportedLanguages for store "${domain.storeKey}"`,
        );
      }

      if (!ALLOWED_THEME_KEYS.includes(domain.themeKey as (typeof ALLOWED_THEME_KEYS)[number])) {
        throw new Error(
          `Unknown theme key "${domain.themeKey}" for store "${domain.storeKey}"`,
        );
      }

      if (!domain.themeRevision || !domain.themeRevision.trim()) {
        throw new Error(
          `Missing theme revision for store "${domain.storeKey}"`,
        );
      }

      const themeTokenPack = domain.themeTokenPack ?? domain.themeKey;
      if (!themeTokenPack.trim()) {
        throw new Error(
          `Missing theme token pack for store "${domain.storeKey}"`,
        );
      }

      if (
        !ALLOWED_CART_UX_MODES.includes(
          domain.cartUxMode as (typeof ALLOWED_CART_UX_MODES)[number],
        )
      ) {
        throw new Error(
          `Invalid cart UX mode "${domain.cartUxMode}" for store "${domain.storeKey}"`,
        );
      }

      if (!domain.cartPath || !domain.cartPath.startsWith("/")) {
        throw new Error(
          `Invalid cart path "${domain.cartPath}" for store "${domain.storeKey}"`,
        );
      }

      const profileExists = EXPERIENCE_PROFILES.some(
        (profile) =>
          profile.id === domain.experienceProfileId &&
          (profile.storeKey === domain.storeKey || profile.storeKey === "*"),
      );
      if (!profileExists) {
        throw new Error(
          `Invalid experience profile binding "${domain.experienceProfileId}" for store "${domain.storeKey}"`,
        );
      }

      const existing = byStore.get(domain.storeKey);
      if (!existing) {
        byStore.set(domain.storeKey, {
          storeFlagIconSrc: domain.storeFlagIconSrc,
          storeFlagIconLabel: domain.storeFlagIconLabel,
          themeKey: domain.themeKey,
          themeRevision: domain.themeRevision,
          themeTokenPack,
          cartUxMode: domain.cartUxMode,
          openCartOnAdd: domain.openCartOnAdd,
        });
        continue;
      }

      if (
        existing.storeFlagIconSrc !== domain.storeFlagIconSrc ||
        existing.storeFlagIconLabel !== domain.storeFlagIconLabel ||
        existing.themeKey !== domain.themeKey ||
        existing.themeRevision !== domain.themeRevision ||
        existing.themeTokenPack !== themeTokenPack ||
        existing.cartUxMode !== domain.cartUxMode ||
        existing.openCartOnAdd !== domain.openCartOnAdd
      ) {
        throw new Error(
          `Conflicting store-wide binding for store "${domain.storeKey}" across domains`,
        );
      }
    }
  }
}