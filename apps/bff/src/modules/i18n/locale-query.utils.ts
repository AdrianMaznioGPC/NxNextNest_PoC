import type { LocaleContext } from "@commerce/shared-types";

export function normalizeQuery(
  query: Record<string, string | string[] | undefined> = {},
): Record<string, string | undefined> {
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    normalized[key] = Array.isArray(value) ? value[0] : value;
  }
  return normalized;
}

export function localeContextFromQuery(
  query: Record<string, string | undefined>,
): Partial<LocaleContext> | undefined {
  const partial: Partial<LocaleContext> = {
    locale: query.locale,
    language: normalizeLanguage(query.language),
    region: query.region,
    currency: query.currency,
    market: query.market,
    domain: query.domain,
  };

  const hasAnyValue = Object.values(partial).some(Boolean);
  return hasAnyValue ? partial : undefined;
}

export function normalizeLanguage(
  input?: string,
): LocaleContext["language"] | undefined {
  if (input === "en" || input === "es" || input === "nl" || input === "fr") {
    return input;
  }
  return undefined;
}
