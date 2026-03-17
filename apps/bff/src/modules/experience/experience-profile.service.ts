import type { LocaleContext } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { I18nService } from "../i18n/i18n.service";
import { EXPERIENCE_PROFILES } from "./experience-profile.catalog";
import type {
  ExperienceProfile,
  ExperienceStoreContext,
  StoreThemeBinding,
  ResolvedExperienceProfile,
} from "./experience-profile.types";
import { ExperienceValidatorService } from "./experience-validator.service";

@Injectable()
export class ExperienceProfileService {
  constructor(
    private readonly i18n: I18nService,
    private readonly validator: ExperienceValidatorService,
  ) {
    this.validator.validateCatalog();
    this.validator.validateDomainBindings(this.i18n.getDomainConfig());
  }

  resolveStoreContext(localeContext: LocaleContext): ExperienceStoreContext {
    const config = this.i18n.getDomainConfig();
    const canonicalHost = resolveCanonicalHost(localeContext.domain, config);
    const fallbackDomain =
      config.domains.find((entry) => entry.host === config.defaultDomain) ??
      config.domains[0];

    const entry =
      config.domains.find((domain) => domain.host === canonicalHost) ??
      fallbackDomain;

    if (!entry) {
      return {
        storeKey: "default-store",
        experienceProfileId: "exp-default-v1",
        storeFlagIconSrc: "/icons/eu.svg",
        storeFlagIconLabel: "European Union",
        themeKey: "theme-default",
        themeRevision: "fallback",
        themeTokenPack: "theme-default",
        language: "en",
        defaultLanguage: "en",
        supportedLanguages: ["en", "es", "nl", "fr"],
        cartUxMode: "drawer",
        cartPath: "/cart",
        openCartOnAdd: true,
      };
    }

    return {
      storeKey: entry.storeKey,
      experienceProfileId: entry.experienceProfileId,
      storeFlagIconSrc: entry.storeFlagIconSrc,
      storeFlagIconLabel: entry.storeFlagIconLabel,
      themeKey: entry.themeKey,
      themeRevision: entry.themeRevision,
      themeTokenPack: entry.themeTokenPack ?? entry.themeKey,
      language:
        entry.supportedLanguages.find((language) => language === localeContext.language) ??
        entry.defaultLanguage,
      defaultLanguage: entry.defaultLanguage,
      supportedLanguages: entry.supportedLanguages.length
        ? entry.supportedLanguages
        : [entry.defaultLanguage],
      cartUxMode: entry.cartUxMode,
      cartPath: entry.cartPath,
      openCartOnAdd: entry.openCartOnAdd,
    };
  }

  resolveProfile(params: {
    storeContext: ExperienceStoreContext;
    routeKind?: string;
  }): ResolvedExperienceProfile {
    const { storeContext, routeKind } = params;
    const resolvedRouteKind = routeKind ?? "*";

    const selectorOrder: Array<{
      storeKey: string | "*";
      routeKind: string | "*";
      locale: string | "*";
    }> = [
      {
        storeKey: storeContext.storeKey,
        routeKind: resolvedRouteKind,
        locale: "*",
      },
      {
        storeKey: storeContext.storeKey,
        routeKind: "*",
        locale: "*",
      },
      {
        storeKey: "*",
        routeKind: "*",
        locale: "*",
      },
    ];

    const profile =
      pickFirstMatchingProfile(selectorOrder) ??
      EXPERIENCE_PROFILES.find(
        (item) => item.id === storeContext.experienceProfileId,
      ) ??
      EXPERIENCE_PROFILES[0];

    if (!profile) {
      throw new Error("No experience profile available");
    }

    return {
      storeKey: storeContext.storeKey,
      experienceProfileId: profile.id,
      storeFlagIconSrc: storeContext.storeFlagIconSrc,
      storeFlagIconLabel: storeContext.storeFlagIconLabel,
      themeKey: storeContext.themeKey,
      themeRevision: storeContext.themeRevision,
      themeTokenPack: storeContext.themeTokenPack ?? storeContext.themeKey,
      language: storeContext.language,
      defaultLanguage: storeContext.defaultLanguage,
      supportedLanguages: storeContext.supportedLanguages,
      cartUxMode: storeContext.cartUxMode,
      cartPath: storeContext.cartPath,
      openCartOnAdd: storeContext.openCartOnAdd,
      layoutKey: profile.layoutKey,
      slotRules: profile.slotRules,
    };
  }

  resolveStoreThemeBinding(
    storeKey: string,
    fallback?: Pick<ExperienceStoreContext, "themeKey" | "themeRevision" | "themeTokenPack">,
  ): StoreThemeBinding {
    const config = this.i18n.getDomainConfig();
    const matched = config.domains.find((domain) => domain.storeKey === storeKey);
    if (matched) {
      return {
        storeKey,
        themeKey: matched.themeKey,
        themeRevision: matched.themeRevision,
        themeTokenPack: matched.themeTokenPack ?? matched.themeKey,
      };
    }

    return {
      storeKey,
      themeKey: fallback?.themeKey ?? "theme-default",
      themeRevision: fallback?.themeRevision ?? "fallback",
      themeTokenPack: fallback?.themeTokenPack ?? fallback?.themeKey ?? "theme-default",
    };
  }
}

function resolveCanonicalHost(
  host: string,
  config: ReturnType<I18nService["getDomainConfig"]>,
): string {
  const normalized = host.toLowerCase();
  const alias = config.aliases?.find((item) => item.host === normalized);
  return alias?.canonicalHost ?? normalized;
}

function pickFirstMatchingProfile(
  selectors: Array<{ storeKey: string | "*"; routeKind: string | "*"; locale: string | "*" }>,
): ExperienceProfile | undefined {
  for (const selector of selectors) {
    const match = EXPERIENCE_PROFILES.find(
      (profile) =>
        profile.storeKey === selector.storeKey &&
        profile.routeKind === selector.routeKind &&
        profile.locale === selector.locale,
    );
    if (match) {
      return match;
    }
  }

  return undefined;
}
