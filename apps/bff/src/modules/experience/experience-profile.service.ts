import type { LocaleContext } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import {
  I18N_CONFIG_PORT,
  type I18nConfigPort,
} from "../../ports/i18n-config.port";
import { I18nService } from "../i18n/i18n.service";
import { EXPERIENCE_PROFILES } from "./experience-profile.catalog";
import type {
  ExperienceProfile,
  ExperienceStoreContext,
  ResolvedExperienceProfile,
  ResolvedExperienceSignals,
  StoreThemeBinding,
} from "./experience-profile.types";
import { ExperienceValidatorService } from "./experience-validator.service";

@Injectable()
export class ExperienceProfileService {
  constructor(
    private readonly i18n: I18nService,
    private readonly validator: ExperienceValidatorService,
    @Inject(I18N_CONFIG_PORT) private readonly i18nConfig: I18nConfigPort,
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
      const defaults = this.i18nConfig.getDefaultStoreContext();
      return { ...defaults };
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
        entry.supportedLanguages.find(
          (language) => language === localeContext.language,
        ) ?? entry.defaultLanguage,
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
    signals: ResolvedExperienceSignals;
  }): ResolvedExperienceProfile {
    const { storeContext, routeKind, signals } = params;
    const resolvedRouteKind = routeKind ?? "*";

    const matchingProfiles = EXPERIENCE_PROFILES.filter((profile) =>
      matchesProfile(
        profile,
        storeContext.storeKey,
        resolvedRouteKind,
        signals,
      ),
    );

    const baseProfile =
      EXPERIENCE_PROFILES.find(
        (item) => item.id === storeContext.experienceProfileId,
      ) ?? EXPERIENCE_PROFILES[0];
    const profile = matchingProfiles.sort(compareSpecificity)[0] ?? baseProfile;

    if (!profile || !baseProfile) {
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
      layoutKey: profile.layoutKey ?? baseProfile.layoutKey,
      slotRules: dedupeSlotRules(baseProfile.slotRules, profile.slotRules),
      signals: {
        ...signals,
        // Profile block overrides are the base layer; directive overrides
        // (already on signals) win. Single source of truth on signals.
        blockOverrides: dedupeBlockOverrides(
          baseProfile.blockOverrides ?? [],
          profile.blockOverrides ?? [],
          signals.blockOverrides,
        ),
      },
    };
  }

  resolveStoreThemeBinding(
    storeKey: string,
    fallback?: Pick<
      ExperienceStoreContext,
      "themeKey" | "themeRevision" | "themeTokenPack"
    >,
  ): StoreThemeBinding {
    const config = this.i18n.getDomainConfig();
    const matched = config.domains.find(
      (domain) => domain.storeKey === storeKey,
    );
    if (matched) {
      return {
        storeKey,
        themeKey: matched.themeKey,
        themeRevision: matched.themeRevision,
        themeTokenPack: matched.themeTokenPack ?? matched.themeKey,
      };
    }

    const defaults = this.i18nConfig.getDefaultStoreContext();
    return {
      storeKey,
      themeKey: fallback?.themeKey ?? defaults.themeKey,
      themeRevision: fallback?.themeRevision ?? defaults.themeRevision,
      themeTokenPack:
        fallback?.themeTokenPack ??
        fallback?.themeKey ??
        defaults.themeTokenPack,
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

function matchesProfile(
  profile: ExperienceProfile,
  storeKey: string,
  routeKind: string,
  signals: ResolvedExperienceSignals,
) {
  return (
    (profile.storeKey === "*" || profile.storeKey === storeKey) &&
    (profile.routeKind === "*" || profile.routeKind === routeKind) &&
    profile.locale === "*" &&
    ((profile.customerProfile ?? "*") === "*" ||
      profile.customerProfile === signals.customerProfile) &&
    ((profile.campaignKey ?? "*") === "*" ||
      profile.campaignKey === signals.campaignKey)
  );
}

function compareSpecificity(a: ExperienceProfile, b: ExperienceProfile) {
  return scoreProfile(b) - scoreProfile(a);
}

function scoreProfile(profile: ExperienceProfile) {
  return [
    profile.routeKind !== "*" ? 32 : 0,
    (profile.customerProfile ?? "*") !== "*" ? 16 : 0,
    (profile.campaignKey ?? "*") !== "*" ? 8 : 0,
    profile.storeKey !== "*" ? 4 : 0,
    profile.locale !== "*" ? 2 : 0,
  ].reduce((sum, value) => sum + value, 0);
}

function dedupeSlotRules(...ruleSets: ExperienceProfile["slotRules"][]) {
  const result = new Map<string, ExperienceProfile["slotRules"][number]>();
  for (const rules of ruleSets) {
    for (const rule of rules) {
      result.set(rule.rendererKey, rule);
    }
  }
  return [...result.values()];
}

function dedupeBlockOverrides(
  ...overrideSets: NonNullable<ExperienceProfile["blockOverrides"]>[]
) {
  const result = new Map<
    string,
    NonNullable<ExperienceProfile["blockOverrides"]>[number]
  >();
  for (const overrides of overrideSets) {
    for (const override of overrides) {
      result.set(override.blockType, override);
    }
  }
  return [...result.values()];
}
