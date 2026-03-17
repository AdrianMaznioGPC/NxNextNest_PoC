import { Injectable } from "@nestjs/common";
import { match, MatchFunction } from "path-to-regexp";
import {
  defaultLocaleContext,
  staticRouteSegmentCatalog,
} from "../../../adapters/mock/mock-data";
import type { StaticRouteSegments } from "../../slug/slug.types";
import type { RouteKind, RouteRuleId } from "./route-rule.types";

type MatchParams = {
  productSlug?: string;
  categoryPath?: string | string[];
  pageSlug?: string;
};

export type CompiledRouteRule = {
  id: Exclude<RouteRuleId, "unknown">;
  routeKind: Exclude<RouteKind, "unknown">;
  pattern: string;
  matcher: MatchFunction<MatchParams>;
};

@Injectable()
export class RouteMatcherFactory {
  private readonly cache = new Map<string, CompiledRouteRule[]>();

  constructor() {
    this.warmup();
  }

  getMatchers(params: {
    locale: string;
    staticSegments: StaticRouteSegments;
    canonicalStaticSegments: StaticRouteSegments;
  }): CompiledRouteRule[] {
    const { locale, staticSegments, canonicalStaticSegments } = params;
    const cacheKey = this.buildCacheKey(
      locale,
      staticSegments,
      canonicalStaticSegments,
    );
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const compiled = this.compileRules(staticSegments, canonicalStaticSegments);
    Object.freeze(compiled);
    this.cache.set(cacheKey, compiled);
    return compiled;
  }

  private compileRules(
    segments: StaticRouteSegments,
    canonicalSegments: StaticRouteSegments,
  ): CompiledRouteRule[] {
    const rules: CompiledRouteRule[] = [
      buildRule("home", "home", "/"),
    ];

    for (const searchSegment of unique([segments.search, canonicalSegments.search])) {
      rules.push(buildRule("search", "search", `/${searchSegment}`));
    }

    for (const productSegment of unique([
      segments.product,
      canonicalSegments.product,
    ])) {
      rules.push(
        buildRule(
          "product-detail",
          "product-detail",
          `/${productSegment}/:productSlug`,
        ),
      );
    }

    for (const categoriesSegment of unique([
      segments.categories,
      canonicalSegments.categories,
    ])) {
      rules.push(
        buildRule("category-list", "category-list", `/${categoriesSegment}`),
      );
      rules.push(
        buildRule(
          "category-detail",
          "category-detail",
          `/${categoriesSegment}/*categoryPath`,
        ),
      );
    }

    for (const cartSegment of unique([segments.cart, canonicalSegments.cart])) {
      rules.push(buildRule("cart", "cart", `/${cartSegment}`));
    }

    rules.push(buildRule("content-page", "content-page", "/:pageSlug"));

    return rules;
  }

  private buildCacheKey(
    locale: string,
    segments: StaticRouteSegments,
    canonicalSegments: StaticRouteSegments,
  ) {
    return JSON.stringify({
      locale,
      segments,
      canonicalSegments,
    });
  }

  private warmup() {
    const defaultSegments = staticRouteSegmentCatalog[defaultLocaleContext.locale];
    if (!defaultSegments) {
      throw new Error("Missing default locale static route segments");
    }

    for (const [locale, segments] of Object.entries(staticRouteSegmentCatalog)) {
      const rules = this.getMatchers({
        locale,
        staticSegments: segments,
        canonicalStaticSegments: defaultSegments,
      });
      this.validateRuleSet(locale, rules);
    }
  }

  private validateRuleSet(locale: string, rules: CompiledRouteRule[]) {
    const signatures = rules.map(
      (rule) => `${rule.id}:${rule.routeKind}:${rule.pattern}`,
    );
    if (new Set(signatures).size !== signatures.length) {
      throw new Error(`Ambiguous route-rule overlap in locale "${locale}"`);
    }
  }

  getHealthSummary() {
    return {
      compiledMatcherSets: this.cache.size,
      locales: [...new Set([...this.cache.keys()].map((key) => JSON.parse(key).locale))],
    };
  }
}

function compileMatcher(pattern: string): MatchFunction<MatchParams> {
  return match(pattern, {
    end: true,
    decode: decodeURIComponent,
  });
}

function buildRule(
  id: Exclude<RouteRuleId, "unknown">,
  routeKind: Exclude<RouteKind, "unknown">,
  pattern: string,
): CompiledRouteRule {
  return {
    id,
    routeKind,
    pattern,
    matcher: compileMatcher(pattern),
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
