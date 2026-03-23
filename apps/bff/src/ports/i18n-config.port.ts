import type {
  DomainConfigModel,
  I18nMessagesModel,
  LanguageCode,
  LocaleContext,
} from "@commerce/shared-types";

export interface I18nConfigPort {
  /** Full domain configuration model */
  getDomainConfig(): DomainConfigModel;

  /** Default locale context used as fallback */
  getDefaultLocaleContext(): LocaleContext;

  /** Messages for a given locale and namespaces */
  getMessages(locale: string, namespaces: string[]): I18nMessagesModel;

  /** Resolve a single translation value by dot-path key (e.g. "page.homeTitle") */
  getCatalogValue(locale: string, key: string): string | undefined;

  /** Current translation version identifier */
  getTranslationVersion(): string;

  /** Resolve a locale string to its canonical catalog locale (e.g. "es" → "es-ES") */
  resolveCatalogLocale(localeOrLanguage?: string): string;

  /** Map a language code to its full locale tag (e.g. "es" → "es-ES") */
  getLocaleByLanguage(language: LanguageCode): string | undefined;

  /** Normalize a raw string into a valid LanguageCode, or undefined */
  normalizeLanguage(input?: string): LanguageCode | undefined;

  /** All supported language codes */
  getSupportedLanguageCodes(): LanguageCode[];
}

export const I18N_CONFIG_PORT = Symbol("I18N_CONFIG_PORT");
