import type {
  DomainConfigEntry,
  LocaleContext,
  SwitchUrlRequest,
  SwitchUrlResponse,
} from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { PageDataService } from "../page-data/page-data.service";
import { RouteRecognitionService } from "../page-data/routing/route-recognition.service";
import { SlugService } from "../slug/slug.service";
import { I18nService } from "./i18n.service";

type QueryMap = Record<string, string | undefined>;

@Injectable()
export class SwitchUrlService {
  constructor(
    private readonly i18n: I18nService,
    private readonly routeRecognition: RouteRecognitionService,
    private readonly pageData: PageDataService,
    private readonly slug: SlugService,
  ) {}

  async resolveTargetUrl(input: SwitchUrlRequest): Promise<SwitchUrlResponse> {
    const sourceHost = normalizeHost(input.sourceHost);
    const sourceLocaleContext = this.i18n.resolveLocaleContext({
      domain: sourceHost,
    });
    const route = this.routeRecognition.recognize(
      input.path,
      sourceLocaleContext,
    );

    const targetDomain = this.i18n.resolveDomainByRegion(input.targetRegion);
    if (!targetDomain) {
      const fallbackHost = this.i18n.getDomainConfig().defaultDomain;
      return {
        targetUrl: buildTargetUrl(input.sourceOrigin, fallbackHost, "/"),
        resolved: {
          routeKind:
            route.routeKind === "unknown" ? undefined : route.routeKind,
          fallbackApplied: true,
          reason: "target_region_unresolved",
        },
      };
    }

    const targetLocaleContext = this.i18n.resolveLocaleContext({
      domain: targetDomain.host,
      region: targetDomain.regionCode || targetDomain.region,
      language: input.targetLanguage,
    });
    const targetPath = await this.resolveTargetPath(
      route,
      targetLocaleContext,
      targetDomain,
    );
    const query = sanitizeQuery(input.query);
    const queryString = new URLSearchParams(query).toString();
    const reason = this.fallbackReason(
      route,
      targetPath,
      targetLocaleContext,
      targetDomain,
    );

    return {
      targetUrl: buildTargetUrl(
        input.sourceOrigin,
        targetDomain.host,
        targetPath,
        queryString,
      ),
      resolved: {
        routeKind: route.routeKind === "unknown" ? undefined : route.routeKind,
        fallbackApplied: reason !== undefined,
        reason,
      },
    };
  }

  private async resolveTargetPath(
    route: ReturnType<RouteRecognitionService["recognize"]>,
    targetLocaleContext: LocaleContext,
    targetDomain: DomainConfigEntry,
  ): Promise<string> {
    const routes = this.slug.getStaticRoutes(targetLocaleContext);
    const homePath = routes.home;

    if (route.routeKind === "unknown" || route.status === 404) {
      return homePath;
    }

    if (route.routeKind === "home") {
      return homePath;
    }

    if (route.routeKind === "search") {
      return routes.search;
    }

    if (route.routeKind === "cart") {
      return targetDomain.cartUxMode === "page" ? routes.cart : homePath;
    }

    if (route.routeKind === "checkout") {
      return routes.checkout;
    }

    if (route.routeKind === "category-list") {
      return routes.categoryList;
    }

    if (route.routeKind === "category-detail" && route.refs.categoryKey) {
      return this.slug.buildCategoryPath(
        targetLocaleContext,
        route.refs.categoryKey,
      );
    }

    if (route.routeKind === "content-page" && route.refs.pageHandle) {
      return this.slug.buildPagePath(
        targetLocaleContext,
        route.refs.pageHandle,
      );
    }

    if (route.routeKind === "product-detail" && route.refs.productHandle) {
      const page = await this.pageData.getProductPage(
        route.refs.productHandle,
        targetLocaleContext,
      );
      if (!page) return homePath;
      return this.slug.buildProductPath(
        targetLocaleContext,
        route.refs.productHandle,
      );
    }

    return homePath;
  }

  private expectedPath(
    route: ReturnType<RouteRecognitionService["recognize"]>,
    targetLocaleContext: LocaleContext,
  ) {
    const routes = this.slug.getStaticRoutes(targetLocaleContext);
    if (route.routeKind === "home") return routes.home;
    if (route.routeKind === "search") return routes.search;
    if (route.routeKind === "cart") return routes.cart;
    if (route.routeKind === "checkout") return routes.checkout;
    if (route.routeKind === "category-list") return routes.categoryList;
    if (route.routeKind === "category-detail" && route.refs.categoryKey) {
      return this.slug.buildCategoryPath(
        targetLocaleContext,
        route.refs.categoryKey,
      );
    }
    if (route.routeKind === "content-page" && route.refs.pageHandle) {
      return this.slug.buildPagePath(
        targetLocaleContext,
        route.refs.pageHandle,
      );
    }
    if (route.routeKind === "product-detail" && route.refs.productHandle) {
      return this.slug.buildProductPath(
        targetLocaleContext,
        route.refs.productHandle,
      );
    }
    return routes.home;
  }

  private fallbackReason(
    route: ReturnType<RouteRecognitionService["recognize"]>,
    resolvedPath: string,
    targetLocaleContext: LocaleContext,
    targetDomain: DomainConfigEntry,
  ): SwitchUrlResponse["resolved"]["reason"] | undefined {
    if (route.routeKind === "unknown" || route.status === 404) {
      return "unknown_route";
    }
    if (route.routeKind === "cart" && targetDomain.cartUxMode !== "page") {
      return "cart_disabled_in_target_store";
    }
    const expected = this.expectedPath(route, targetLocaleContext);
    if (resolvedPath !== expected) {
      return "entity_unavailable_in_region";
    }
    return undefined;
  }
}

function normalizeHost(host: string): string {
  return host.toLowerCase().split(":")[0] || "";
}

function sanitizeQuery(query: QueryMap = {}): Record<string, string> {
  const blocked = new Set([
    "locale",
    "language",
    "region",
    "currency",
    "market",
    "domain",
    "path",
  ]);
  const next: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (!value || blocked.has(key)) continue;
    next[key] = value;
  }
  return next;
}

function buildTargetUrl(
  sourceOrigin: string | undefined,
  targetHost: string,
  targetPath: string,
  queryString?: string,
): string {
  const safePath = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
  const fallbackBase = `https://${targetHost}`;

  try {
    const base = sourceOrigin ? new URL(sourceOrigin) : new URL(fallbackBase);
    base.hostname = targetHost;
    base.pathname = safePath;
    base.search = queryString ? `?${queryString}` : "";
    base.hash = "";
    return base.toString();
  } catch {
    return `${fallbackBase}${safePath}${queryString ? `?${queryString}` : ""}`;
  }
}
