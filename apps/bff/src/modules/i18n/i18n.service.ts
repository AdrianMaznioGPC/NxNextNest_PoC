import type {
  DomainConfigEntry,
  DomainConfigModel,
  I18nMessagesModel,
  LanguageCode,
  LocaleContext,
  ResolvedPageModel,
} from "@commerce/shared-types";
import { IntlMessageFormat } from "intl-messageformat";
import { Injectable } from "@nestjs/common";
import {
  defaultLocaleContext,
  domainConfig,
  getCatalogValue,
  getMessagesForLocale,
  localeByLanguage,
  normalizeLanguage,
  resolveCatalogLocale,
  translationVersion,
} from "../../adapters/mock/mock-data";
import { SlugService } from "../slug/slug.service";

const SHELL_NAMESPACES = ["common", "nav", "cart"] as const;

@Injectable()
export class I18nService {
  private readonly formatterCache = new Map<string, IntlMessageFormat>();

  constructor(private readonly slug: SlugService) {}

  getDomainConfig(): DomainConfigModel {
    return domainConfig;
  }

  resolveLocaleContext(input?: Partial<LocaleContext>): LocaleContext {
    const host = input?.domain?.toLowerCase();

    const matched = this.resolveDomainEntryByHost(host);
    if (matched) {
      const defaultLanguage = matched.defaultLanguage;
      const supportedLanguages = matched.supportedLanguages.length
        ? matched.supportedLanguages
        : [defaultLanguage];
      const preferredLanguage =
        normalizeLanguage(input?.language) ??
        normalizeLanguage(input?.locale) ??
        defaultLanguage;
      const language = supportedLanguages.includes(preferredLanguage)
        ? preferredLanguage
        : defaultLanguage;
      const region = matched.regionCode || matched.region;

      return {
        locale: toLocaleTag(language, region),
        language,
        region,
        currency: matched.currency,
        market: matched.market,
        domain: matched.domain,
      };
    }

    if (input?.locale) {
      const [rawLanguage = "en", region = "US"] = input.locale.split("-");
      const language = normalizeLanguage(input.language ?? rawLanguage) ?? "en";
      return {
        locale: toLocaleTag(language, region),
        language,
        region,
        currency: input.currency ?? defaultLocaleContext.currency,
        market: input.market ?? region,
        domain: host ?? defaultLocaleContext.domain,
      };
    }

    return defaultLocaleContext;
  }

  getMessages(locale: string, namespaces: string[]): I18nMessagesModel {
    const resolvedLocale = resolveCatalogLocale(locale);
    return getMessagesForLocale(resolvedLocale, namespaces);
  }

  getTranslationVersion(): string {
    return translationVersion;
  }

  resolveNamespaces(model: ResolvedPageModel): string[] {
    const set = new Set<string>(SHELL_NAMESPACES);

    for (const slot of model.slots ?? []) {
      if (slot.rendererKey === "page.search-results") {
        set.add("search");
        set.add("sort");
        continue;
      }
      if (
        slot.rendererKey === "page.category-products" ||
        slot.rendererKey === "page.category-list" ||
        slot.rendererKey === "page.category-subcollections"
      ) {
        set.add("sort");
      }
      if (slot.rendererKey.startsWith("page.")) {
        set.add("page");
      }
    }

    for (const node of model.content ?? []) {
      if (node.type === "search-results") {
        set.add("search");
        set.add("sort");
      } else if (
        node.type === "category-products" ||
        node.type === "category-list" ||
        node.type === "category-subcollections"
      ) {
        set.add("sort");
      } else {
        set.add("page");
      }
    }

    return [...set];
  }

  t(
    locale: string,
    key: string,
    values?: Record<string, string | number | boolean>,
  ): string {
    const fallback = getCatalogValue(defaultLocaleContext.locale, key) ?? key;
    const resolvedLocale = resolveCatalogLocale(locale);
    const raw = getCatalogValue(resolvedLocale, key) ?? fallback;
    return this.formatMessage(raw, resolvedLocale, values);
  }

  buildAlternates(path: string): Record<string, string> {
    return this.slug.buildAlternates(path);
  }

  resolveDomainEntryByHost(host?: string): DomainConfigEntry | undefined {
    if (!host) return undefined;
    const config = this.getDomainConfig();
    const normalizedHost = host.toLowerCase();
    const alias = config.aliases?.find(
      (item) => item.host.toLowerCase() === normalizedHost,
    );
    const canonicalHost = alias?.canonicalHost ?? normalizedHost;
    return config.domains.find((item) => item.host === canonicalHost);
  }

  resolveDomainByRegion(regionCode: string): DomainConfigEntry | undefined {
    const normalized = regionCode.toUpperCase();
    const config = this.getDomainConfig();
    const canonicalMatch = config.domains.find(
      (item) =>
        item.canonical &&
        (item.regionCode || item.region).toUpperCase() === normalized,
    );
    if (canonicalMatch) return canonicalMatch;
    return config.domains.find(
      (item) => (item.regionCode || item.region).toUpperCase() === normalized,
    );
  }

  private formatMessage(
    template: string,
    locale: string,
    values?: Record<string, string | number | boolean>,
  ): string {
    if (!values || Object.keys(values).length === 0) {
      return template;
    }

    const cacheKey = `${locale}::${template}`;
    let formatter = this.formatterCache.get(cacheKey);
    if (!formatter) {
      formatter = new IntlMessageFormat(template, locale);
      this.formatterCache.set(cacheKey, formatter);
    }

    const formatted = formatter.format(values);
    if (typeof formatted === "string") {
      return formatted;
    }

    if (Array.isArray(formatted)) {
      return formatted.map((part) => String(part)).join("");
    }

    return String(formatted);
  }
}

function toLocaleTag(language: LanguageCode, region: string) {
  const locale = localeByLanguage[language];
  if (!locale) {
    return `${language}-${region}`;
  }

  const [, fallbackRegion = region] = locale.split("-");
  return `${language}-${fallbackRegion}`;
}
