import type {
  DomainConfigModel,
  I18nMessagesModel,
  LanguageCode,
  LocaleContext,
} from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { I18nConfigPort } from "../../ports/i18n-config.port";
import {
  defaultLocaleContext,
  domainConfig,
  getCatalogValue,
  getMessagesForLocale,
  localeByLanguage,
  normalizeLanguage,
  resolveCatalogLocale,
  supportedLanguageCodes,
  translationVersion,
} from "./mock-data";

@Injectable()
export class MockI18nConfigAdapter implements I18nConfigPort {
  getDomainConfig(): DomainConfigModel {
    return domainConfig;
  }

  getDefaultLocaleContext(): LocaleContext {
    return defaultLocaleContext;
  }

  getMessages(locale: string, namespaces: string[]): I18nMessagesModel {
    const resolvedLocale = resolveCatalogLocale(locale);
    return getMessagesForLocale(resolvedLocale, namespaces);
  }

  getCatalogValue(locale: string, key: string): string | undefined {
    return getCatalogValue(locale, key);
  }

  getTranslationVersion(): string {
    return translationVersion;
  }

  resolveCatalogLocale(localeOrLanguage?: string): string {
    return resolveCatalogLocale(localeOrLanguage);
  }

  getLocaleByLanguage(language: LanguageCode): string | undefined {
    return localeByLanguage[language];
  }

  normalizeLanguage(input?: string): LanguageCode | undefined {
    return normalizeLanguage(input);
  }

  getSupportedLanguageCodes(): LanguageCode[] {
    return [...supportedLanguageCodes];
  }
}
