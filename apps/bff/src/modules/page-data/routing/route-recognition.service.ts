import type { LocaleContext } from "@commerce/shared-types";
import { performance } from "node:perf_hooks";
import { Injectable, Logger } from "@nestjs/common";
import {
  localeByLanguage,
  normalizeLanguage,
} from "../../../adapters/mock/mock-data";
import { RouteMatcherFactory } from "./route-matcher.factory";
import type { ResolvedRouteDescriptor, RouteKind } from "./route-rule.types";
import { SlugIndexService } from "./slug-index.service";
import { ScalabilityMetricsService } from "../../system/scalability-metrics.service";

const TRANSLATED_SLUGS_REDIRECT_ENABLED =
  process.env.TRANSLATED_SLUGS_REDIRECT_ENABLED === "true";

@Injectable()
export class RouteRecognitionService {
  private readonly logger = new Logger(RouteRecognitionService.name);

  constructor(
    private readonly matcherFactory: RouteMatcherFactory,
    private readonly slugIndex: SlugIndexService,
    private readonly metrics: ScalabilityMetricsService,
  ) {}

  recognize(
    path: string,
    localeContext: LocaleContext,
  ): ResolvedRouteDescriptor {
    const start = performance.now();
    const normalizedPath = normalizePath(path);
    const prefixResolution = this.slugIndex.stripLanguagePrefix(normalizedPath);
    const effectiveLocaleContext = resolveEffectiveLocaleContext(
      localeContext,
      prefixResolution.languagePrefix,
    );
    const primary = this.tryRecognize({
      requestedPath: normalizedPath,
      strippedPath: prefixResolution.strippedPath,
      localeContext: effectiveLocaleContext,
      start,
    });
    if (primary) {
      this.metrics.recordError(
        `language_source:${prefixResolution.languagePrefix ? "prefix" : "default"}`,
      );
      return primary;
    }

    if (!prefixResolution.languagePrefix) {
      const fallback = this.tryLanguageFallback({
        requestedPath: normalizedPath,
        strippedPath: prefixResolution.strippedPath,
        localeContext: effectiveLocaleContext,
        start,
      });
      if (fallback) {
        return fallback;
      }
    }

    return this.notFound(
      normalizedPath,
      effectiveLocaleContext,
      "unknown",
      performance.now() - start,
    );
  }

  private tryRecognize(params: {
    requestedPath: string;
    strippedPath: string;
    localeContext: LocaleContext;
    start: number;
  }): ResolvedRouteDescriptor | undefined {
    const { requestedPath, strippedPath, localeContext, start } = params;
    const locale = this.slugIndex.getSupportedLocale(localeContext.locale);
    const defaultLocale = this.slugIndex.getDefaultLocale();
    const staticSegments = this.slugIndex.getStaticSegments(locale);
    const canonicalStaticSegments =
      this.slugIndex.getStaticSegments(defaultLocale);
    const matchers = this.matcherFactory.getMatchers({
      locale,
      staticSegments,
      canonicalStaticSegments,
    });

    for (const rule of matchers) {
      const result = rule.matcher(strippedPath);
      if (!result) continue;

      if (rule.routeKind === "home") {
        return this.finalize({
          routeKind: "home",
          requestedPath,
          resolvedPath: this.slugIndex.withLanguagePrefix("/", localeContext),
          canonicalPath: "/",
          refs: {},
          matchedRuleId: rule.id,
          localeContext,
          latencyMs: performance.now() - start,
        });
      }

      if (rule.routeKind === "search") {
        return this.finalize({
          routeKind: "search",
          requestedPath,
          resolvedPath: this.slugIndex.withLanguagePrefix(
            this.slugIndex.buildSearchPath(locale),
            localeContext,
          ),
          canonicalPath: this.slugIndex.buildSearchPath(defaultLocale),
          refs: {},
          matchedRuleId: rule.id,
          localeContext,
          latencyMs: performance.now() - start,
        });
      }

      if (rule.routeKind === "cart") {
        return this.finalize({
          routeKind: "cart",
          requestedPath,
          resolvedPath: this.slugIndex.withLanguagePrefix(
            this.slugIndex.buildCartPath(locale),
            localeContext,
          ),
          canonicalPath: this.slugIndex.buildCartPath(defaultLocale),
          refs: {},
          matchedRuleId: rule.id,
          localeContext,
          latencyMs: performance.now() - start,
        });
      }

      if (rule.routeKind === "checkout") {
        return this.finalize({
          routeKind: "checkout",
          requestedPath,
          resolvedPath: this.slugIndex.withLanguagePrefix(
            this.slugIndex.buildCheckoutPath(locale),
            localeContext,
          ),
          canonicalPath: this.slugIndex.buildCheckoutPath(defaultLocale),
          refs: {},
          matchedRuleId: rule.id,
          localeContext,
          latencyMs: performance.now() - start,
        });
      }

      if (rule.routeKind === "product-detail") {
        const rawSlug = pickString(result.params.productSlug);
        if (!rawSlug) {
          continue;
        }

        const productHandle = this.slugIndex.resolveProductHandle(
          locale,
          rawSlug,
        );
        if (!productHandle) {
          continue;
        }

        return this.finalize({
          routeKind: "product-detail",
          requestedPath,
          resolvedPath: this.slugIndex.withLanguagePrefix(
            this.slugIndex.buildProductPath(locale, productHandle),
            localeContext,
          ),
          canonicalPath: this.slugIndex.buildProductPath(
            defaultLocale,
            productHandle,
          ),
          refs: { productHandle },
          matchedRuleId: rule.id,
          localeContext,
          latencyMs: performance.now() - start,
        });
      }

      if (rule.routeKind === "category-list") {
        return this.finalize({
          routeKind: "category-list",
          requestedPath,
          resolvedPath: this.slugIndex.withLanguagePrefix(
            this.slugIndex.buildCategoryListPath(locale),
            localeContext,
          ),
          canonicalPath: this.slugIndex.buildCategoryListPath(defaultLocale),
          refs: {},
          matchedRuleId: rule.id,
          localeContext,
          latencyMs: performance.now() - start,
        });
      }

      if (rule.routeKind === "category-detail") {
        const rawCategoryPath = pickPath(result.params.categoryPath);
        if (!rawCategoryPath) {
          continue;
        }

        const categoryKey = this.slugIndex.resolveCategoryKey(
          locale,
          rawCategoryPath,
        );
        if (!categoryKey) {
          continue;
        }

        return this.finalize({
          routeKind: "category-detail",
          requestedPath,
          resolvedPath: this.slugIndex.withLanguagePrefix(
            this.slugIndex.buildCategoryPath(locale, categoryKey),
            localeContext,
          ),
          canonicalPath: this.slugIndex.buildCategoryPath(
            defaultLocale,
            categoryKey,
          ),
          refs: { categoryKey },
          matchedRuleId: rule.id,
          localeContext,
          latencyMs: performance.now() - start,
        });
      }

      if (rule.routeKind === "content-page") {
        const rawSlug = pickString(result.params.pageSlug);
        if (!rawSlug) {
          continue;
        }

        const pageHandle = this.slugIndex.resolvePageHandle(locale, rawSlug);
        if (!pageHandle) {
          continue;
        }

        return this.finalize({
          routeKind: "content-page",
          requestedPath,
          resolvedPath: this.slugIndex.withLanguagePrefix(
            this.slugIndex.buildPagePath(locale, pageHandle),
            localeContext,
          ),
          canonicalPath: this.slugIndex.buildPagePath(
            defaultLocale,
            pageHandle,
          ),
          refs: { pageHandle },
          matchedRuleId: rule.id,
          localeContext,
          latencyMs: performance.now() - start,
        });
      }
    }

    return undefined;
  }

  private tryLanguageFallback(params: {
    requestedPath: string;
    strippedPath: string;
    localeContext: LocaleContext;
    start: number;
  }): ResolvedRouteDescriptor | undefined {
    const { requestedPath, strippedPath, localeContext, start } = params;
    const { supportedLanguages } = this.slugIndex.getDomainLanguageConfig(
      localeContext.domain,
    );
    const baseLanguage = normalizeLanguage(localeContext.language);

    const candidates = supportedLanguages.filter(
      (language) => language !== baseLanguage,
    );
    const matches: ResolvedRouteDescriptor[] = [];

    for (const language of candidates) {
      const fallbackLocale = localeByLanguage[language];
      if (!fallbackLocale) {
        continue;
      }
      const fallbackContext: LocaleContext = {
        ...localeContext,
        language,
        locale: fallbackLocale,
      };
      const match = this.tryRecognize({
        requestedPath,
        strippedPath,
        localeContext: fallbackContext,
        start,
      });
      if (match && match.routeKind !== "unknown" && match.status !== 404) {
        matches.push(match);
      }
    }

    if (matches.length === 1) {
      const matched = matches[0];
      if (!matched) {
        return undefined;
      }
      this.metrics.recordError("language_source:fallback");
      this.metrics.recordError("route_fallback_match_total");
      this.logger.log(
        JSON.stringify({
          type: "route_fallback_match",
          requestedPath,
          resolvedPath: matched.resolvedPath,
          routeKind: matched.routeKind,
          language: matched.localeContext.language,
          domain: matched.localeContext.domain,
        }),
      );
      return {
        routeKind: matched.routeKind,
        requestedPath: matched.requestedPath,
        resolvedPath: matched.resolvedPath,
        canonicalPath: matched.canonicalPath,
        status: 301,
        redirectTo: matched.resolvedPath,
        refs: matched.refs,
        matchedRuleId: matched.matchedRuleId,
        localeContext: matched.localeContext,
      };
    }

    if (matches.length > 1) {
      this.metrics.recordError("route_fallback_ambiguous_total");
      this.logger.warn(
        JSON.stringify({
          type: "route_fallback_ambiguous",
          requestedPath,
          candidates: matches.map((match) => ({
            routeKind: match.routeKind,
            language: match.localeContext.language,
            resolvedPath: match.resolvedPath,
          })),
        }),
      );
    }

    return undefined;
  }

  private finalize(input: {
    routeKind: Exclude<RouteKind, "unknown">;
    requestedPath: string;
    resolvedPath: string;
    canonicalPath: string;
    refs: {
      productHandle?: string;
      categoryKey?: string;
      pageHandle?: string;
    };
    matchedRuleId: Exclude<ResolvedRouteDescriptor["matchedRuleId"], "unknown">;
    localeContext: LocaleContext;
    latencyMs: number;
  }): ResolvedRouteDescriptor {
    const defaultLocale = this.slugIndex.getDefaultLocale();
    const shouldRedirect =
      TRANSLATED_SLUGS_REDIRECT_ENABLED &&
      input.localeContext.locale !== defaultLocale &&
      input.requestedPath !== input.resolvedPath;

    const resolved: ResolvedRouteDescriptor = {
      routeKind: input.routeKind,
      requestedPath: input.requestedPath,
      resolvedPath: input.resolvedPath,
      canonicalPath: input.canonicalPath,
      status: shouldRedirect ? 301 : 200,
      redirectTo: shouldRedirect ? input.resolvedPath : undefined,
      refs: input.refs,
      matchedRuleId: input.matchedRuleId,
      localeContext: input.localeContext,
    };
    this.metrics.recordRoute({
      matchedRuleId: input.matchedRuleId,
      locale: input.localeContext.locale,
      status: resolved.status,
      latencyMs: input.latencyMs,
    });
    return resolved;
  }

  private notFound(
    requestedPath: string,
    localeContext: LocaleContext,
    matchedRuleId: ResolvedRouteDescriptor["matchedRuleId"],
    latencyMs: number,
  ): ResolvedRouteDescriptor {
    const resolved: ResolvedRouteDescriptor = {
      routeKind: "unknown",
      requestedPath,
      resolvedPath: requestedPath,
      canonicalPath: requestedPath,
      status: 404,
      refs: {},
      matchedRuleId,
      localeContext,
    };
    this.metrics.recordRoute({
      matchedRuleId,
      locale: localeContext.locale,
      status: resolved.status,
      latencyMs,
    });
    return resolved;
  }
}

function resolveEffectiveLocaleContext(
  localeContext: LocaleContext,
  languagePrefix?: string,
): LocaleContext {
  const overrideLanguage = normalizeLanguage(languagePrefix);
  if (!overrideLanguage) {
    return localeContext;
  }

  return {
    ...localeContext,
    language: overrideLanguage,
    locale: localeByLanguage[overrideLanguage],
  };
}

function pickString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function pickPath(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value.join("/");
  }
  return value;
}

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.replace(/\/+$/, "") || "/";
}
