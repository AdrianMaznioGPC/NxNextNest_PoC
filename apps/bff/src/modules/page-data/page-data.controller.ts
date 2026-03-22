import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Query,
  Res,
} from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import type { LocaleContext, PageBootstrapModel } from "@commerce/shared-types";
import type { FastifyReply } from "fastify";
import { I18nService } from "../i18n/i18n.service";
import { PageDataService } from "./page-data.service";
import { BootstrapOrchestratorService } from "./bootstrap-orchestrator.service";
import { SlotDataService } from "./slot-data.service";
import { CachePolicyService } from "../system/cache-policy.service";

@Controller("page-data")
export class PageDataController {
  constructor(
    private readonly pageData: PageDataService,
    private readonly bootstrapOrchestrator: BootstrapOrchestratorService,
    private readonly i18n: I18nService,
    private readonly slotData: SlotDataService,
    private readonly cachePolicy: CachePolicyService,
  ) {}

  @Get("bootstrap")
  async getBootstrap(
    @Query("path") path?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
    @Headers("if-none-match") ifNoneMatch?: string,
    @Headers("cookie") cookieHeader?: string,
    @Headers("x-request-id") incomingRequestId?: string,
    @Res({ passthrough: true }) response?: FastifyReply,
  ): Promise<PageBootstrapModel> {
    if (!path) {
      throw new BadRequestException("Query parameter 'path' is required");
    }

    const requestId = incomingRequestId || randomUUID();
    const queryMap = normalizeQuery(query);
    delete queryMap.path;
    const localeContext = localeContextFromQuery(queryMap);
    const bootstrap = await this.bootstrapOrchestrator.buildBootstrap({
      path,
      query: queryMap,
      requestedLocaleContext: localeContext,
      requestId,
      cookieHeader,
    });

    const etag = weakEtag(bootstrap);
    const cacheHints =
      bootstrap.page.cacheHints ||
      this.cachePolicy.getBootstrapCacheHints(
        bootstrap.page.routeKind,
        bootstrap.page.status,
      );

    response?.header("X-Request-Id", requestId);
    response?.header("ETag", etag);
    response?.header(
      "Cache-Control",
      this.cachePolicy.toCacheControl(cacheHints),
    );
    response?.header(
      "Vary",
      "Accept-Encoding, X-Locale-Context, X-Store-Context, X-Request-Host, X-Forwarded-Host",
    );
    if (bootstrap.page.localizationAudit) {
      response?.header(
        "X-Link-Locale-Audit",
        JSON.stringify(bootstrap.page.localizationAudit),
      );
    }

    if (ifNoneMatch === etag) {
      response?.status(304);
      return undefined as unknown as PageBootstrapModel;
    }

    return bootstrap;
  }

  @Get("slot")
  async getSlot(
    @Query("path") path?: string,
    @Query("slotId") slotId?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
    @Headers("if-none-match") ifNoneMatch?: string,
    @Headers("x-request-id") incomingRequestId?: string,
    @Res({ passthrough: true }) response?: FastifyReply,
  ) {
    if (!path) {
      throw new BadRequestException("Query parameter 'path' is required");
    }
    if (!slotId) {
      throw new BadRequestException("Query parameter 'slotId' is required");
    }

    const queryMap = normalizeQuery(query);
    delete queryMap.path;
    delete queryMap.slotId;
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(queryMap),
    );

    const requestId = incomingRequestId || randomUUID();
    return this.slotData.resolveSlotPayload({
      path,
      slotId,
      query: queryMap,
      localeContext,
      requestId,
      ifNoneMatch,
      response,
    });
  }

  @Get("layout")
  getLayoutData(
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const queryMap = normalizeQuery(query);
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(queryMap),
    );
    return this.pageData.getLayoutData(localeContext);
  }

  @Get("home")
  getHomePage(
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const queryMap = normalizeQuery(query);
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(queryMap),
    );
    return this.pageData.getHomePage(localeContext);
  }

  @Get("categories")
  getCategoryListPage(
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const queryMap = normalizeQuery(query);
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(queryMap),
    );
    return this.pageData.getCategoryListPage(localeContext);
  }

  @Get("categories/*")
  async getCategoryPage(
    @Param("*") path: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const queryMap = normalizeQuery(query);
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(queryMap),
    );
    const slugs = path.split("/").filter(Boolean);
    const data = await this.pageData.getCategoryPage(
      slugs,
      sortKey,
      reverse === "true",
      localeContext,
    );
    if (!data) throw new NotFoundException();
    return data;
  }

  @Get("product/:handle")
  async getProductPage(
    @Param("handle") handle: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const queryMap = normalizeQuery(query);
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(queryMap),
    );
    const data = await this.pageData.getProductPage(handle, localeContext);
    if (!data) throw new NotFoundException();
    return data;
  }

  @Get("search")
  getSearchPage(
    @Query("q") query?: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
    @Query() queryParams?: Record<string, string | string[] | undefined>,
  ) {
    const queryMap = normalizeQuery(queryParams);
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(queryMap),
    );
    return this.pageData.getSearchPage(
      query,
      sortKey,
      reverse === "true",
      localeContext,
    );
  }
}

function normalizeQuery(
  query: Record<string, string | string[] | undefined> = {},
): Record<string, string | undefined> {
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    normalized[key] = Array.isArray(value) ? value[0] : value;
  }
  return normalized;
}

function localeContextFromQuery(query: Record<string, string | undefined>) {
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

function normalizeLanguage(input?: string): LocaleContext["language"] | undefined {
  if (
    input === "en" ||
    input === "es" ||
    input === "nl" ||
    input === "fr"
  ) {
    return input;
  }
  return undefined;
}

function weakEtag(input: unknown): string {
  const json = JSON.stringify(input);
  const digest = createHash("sha256").update(json).digest("base64url");
  return `W/"${digest}"`;
}
