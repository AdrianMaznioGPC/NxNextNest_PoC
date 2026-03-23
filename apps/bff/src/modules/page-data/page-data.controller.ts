import type { PageBootstrapModel } from "@commerce/shared-types";
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
import type { FastifyReply } from "fastify";
import { createHash, randomUUID } from "node:crypto";
import { I18nService } from "../i18n/i18n.service";
import {
  localeContextFromQuery,
  normalizeQuery,
} from "../i18n/locale-query.utils";
import { CachePolicyService } from "../system/cache-policy.service";
import { BootstrapOrchestratorService } from "./bootstrap-orchestrator.service";
import { PageDataService } from "./page-data.service";
import { SlotDataService } from "./slot-data.service";

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
  getHomePage(@Query() query?: Record<string, string | string[] | undefined>) {
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

function weakEtag(input: unknown): string {
  const json = JSON.stringify(input);
  const digest = createHash("sha256").update(json).digest("base64url");
  return `W/"${digest}"`;
}
