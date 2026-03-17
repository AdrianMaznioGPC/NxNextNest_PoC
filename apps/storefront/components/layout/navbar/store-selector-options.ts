import type { DomainConfigModel, LanguageCode } from "lib/types";

export type RegionOption = {
  regionCode: string;
  host: string;
  label: string;
  defaultLanguage: LanguageCode;
};

const REGION_LABELS: Record<string, string> = {
  US: "United States",
  ES: "Espana",
  NL: "Nederland",
};

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  es: "Espanol",
  nl: "Nederlands",
  fr: "Francais",
};

export function buildRegionOptions(config: DomainConfigModel): RegionOption[] {
  const byRegion = new Map<string, RegionOption>();

  for (const domain of config.domains) {
    const regionCode = (domain.regionCode || domain.region).toUpperCase();
    if (byRegion.has(regionCode)) continue;
    byRegion.set(regionCode, {
      regionCode,
      host: domain.host,
      label: REGION_LABELS[regionCode] ?? regionCode,
      defaultLanguage: domain.defaultLanguage,
    });
  }

  return [...byRegion.values()].sort((a, b) =>
    a.regionCode.localeCompare(b.regionCode),
  );
}
