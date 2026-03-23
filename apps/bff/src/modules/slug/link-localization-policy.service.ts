import type {
  LanguageCode,
  LinkLocalizationAudit,
  LocaleContext,
} from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { SlugMapperService } from "./slug-mapper.service";
import { SlugService } from "./slug.service";

const KNOWN_LANGUAGE_PREFIXES: LanguageCode[] = ["en", "es", "nl", "fr"];
const RESERVED_PATH_PREFIXES = ["/api", "/_next"];
const PATH_LIKE_KEY = /(path|href|url)$/i;

@Injectable()
export class LinkLocalizationPolicyService {
  constructor(
    private readonly slug: SlugService,
    private readonly mapper: SlugMapperService,
  ) {}

  localizeInternalPath(path: string, localeContext: LocaleContext): string {
    if (!isInternalPath(path) || isReservedPath(path)) {
      return path;
    }
    const [pathname, suffix] = splitPathAndSuffix(path);
    const strippedPath =
      this.mapper.extractLanguagePrefix(pathname).strippedPath;
    const localized = this.slug.localizePath(strippedPath, localeContext);
    return `${localized}${suffix}`;
  }

  buildProductPath(
    localeContext: LocaleContext,
    productHandle: string,
  ): string {
    return this.slug.buildProductPath(localeContext, productHandle);
  }

  buildPagePath(localeContext: LocaleContext, pageHandle: string): string {
    return this.slug.buildPagePath(localeContext, pageHandle);
  }

  getDomainDefaultLanguage(domain?: string): LanguageCode {
    return this.mapper.getDomainLanguageConfig(domain).defaultLanguage;
  }

  assertPrefixPolicy(
    path: string,
    localeContext: LocaleContext,
  ): {
    compliant: boolean;
    expectedPrefix?: string;
    actualPrefix?: string;
  } {
    if (!isInternalPath(path) || isReservedPath(path)) {
      return { compliant: true };
    }

    const pathname = stripSearchAndHash(path);
    const { defaultLanguage } = this.mapper.getDomainLanguageConfig(
      localeContext.domain,
    );
    const language =
      normalizeLanguage(localeContext.language) ?? defaultLanguage;
    const actualPrefix = extractLanguagePrefix(pathname);

    if (language === defaultLanguage) {
      return {
        compliant: actualPrefix === undefined,
        expectedPrefix: undefined,
        actualPrefix,
      };
    }

    return {
      compliant: actualPrefix === language,
      expectedPrefix: language,
      actualPrefix,
    };
  }

  normalizePathFields<T>(
    input: T,
    localeContext: LocaleContext,
  ): {
    value: T;
    audit: LinkLocalizationAudit;
  } {
    const { defaultLanguage } = this.mapper.getDomainLanguageConfig(
      localeContext.domain,
    );
    const language =
      normalizeLanguage(localeContext.language) ?? defaultLanguage;
    const samples = new Set<string>();
    let nonCompliantLinkCount = 0;
    let normalizedLinkCount = 0;

    const walk = (value: unknown, key?: string): unknown => {
      if (Array.isArray(value)) {
        return value.map((item) => walk(item));
      }

      if (typeof value === "object" && value !== null) {
        const next: Record<string, unknown> = {};
        for (const [childKey, childValue] of Object.entries(value)) {
          next[childKey] = walk(childValue, childKey);
        }
        return next;
      }

      if (
        typeof value === "string" &&
        key &&
        PATH_LIKE_KEY.test(key) &&
        isInternalPath(value) &&
        !isReservedPath(value)
      ) {
        const policy = this.assertPrefixPolicy(value, localeContext);
        if (!policy.compliant) {
          nonCompliantLinkCount += 1;
          if (samples.size < 5) {
            samples.add(value);
          }
        }
        const normalized = this.localizeInternalPath(value, localeContext);
        if (normalized !== value) {
          normalizedLinkCount += 1;
        }
        return normalized;
      }

      return value;
    };

    return {
      value: walk(input) as T,
      audit: {
        language,
        defaultLanguage,
        nonCompliantLinkCount,
        normalizedLinkCount,
        samplePaths: [...samples],
      },
    };
  }
}

function isInternalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

function isReservedPath(path: string): boolean {
  return RESERVED_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

function stripSearchAndHash(path: string): string {
  const hashIndex = path.indexOf("#");
  const queryIndex = path.indexOf("?");
  const cutIndex = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  return cutIndex === undefined ? path : path.slice(0, cutIndex);
}

function splitPathAndSuffix(path: string): [string, string] {
  const queryIndex = path.indexOf("?");
  const hashIndex = path.indexOf("#");
  const cutIndex = [queryIndex, hashIndex]
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (cutIndex === undefined) {
    return [path, ""];
  }

  return [path.slice(0, cutIndex), path.slice(cutIndex)];
}

function extractLanguagePrefix(pathname: string): LanguageCode | undefined {
  const parts = pathname.split("/").filter(Boolean);
  const first = normalizeLanguage(parts[0]);
  if (!first) return undefined;
  return first;
}

function normalizeLanguage(input?: string): LanguageCode | undefined {
  if (!input) return undefined;
  const normalized = input.toLowerCase().split("-")[0];
  if (KNOWN_LANGUAGE_PREFIXES.includes(normalized as LanguageCode)) {
    return normalized as LanguageCode;
  }
  return undefined;
}
