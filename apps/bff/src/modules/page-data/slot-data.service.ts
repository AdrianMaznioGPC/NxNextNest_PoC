import type {
  LocaleContext,
  SlotPayloadModel,
  SlotPresentation,
} from "@commerce/shared-types";
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { createHash } from "node:crypto";
import { performance } from "node:perf_hooks";
import {
  CONTENT_SUPPLEMENT_PORT,
  type ContentSupplementPort,
} from "../../ports/content-supplement.port";
import { I18nService } from "../i18n/i18n.service";
import { LinkLocalizationPolicyService } from "../slug/link-localization-policy.service";
import { CachePolicyService } from "../system/cache-policy.service";
import { LoadSheddingService } from "../system/load-shedding.service";
import { ScalabilityMetricsService } from "../system/scalability-metrics.service";
import { withLanguageScopedTags } from "./cache-tag.utils";
import { PageDataService } from "./page-data.service";

type QueryMap = Record<string, string | undefined>;
const DEBUG_PDP_REVIEWS_DELAY_MS = Number(
  process.env.DEBUG_PDP_REVIEWS_DELAY_MS ?? "0",
);
const SLOT_MAX_INFLIGHT = Number(process.env.SLOT_MAX_INFLIGHT ?? "512");
const SLOT_RETRY_AFTER_SECONDS = Number(
  process.env.SLOT_RETRY_AFTER_SECONDS ?? "2",
);

@Injectable()
export class SlotDataService {
  private readonly logger = new Logger(SlotDataService.name);

  constructor(
    private readonly pageData: PageDataService,
    private readonly i18n: I18nService,
    private readonly linkLocalization: LinkLocalizationPolicyService,
    private readonly cachePolicy: CachePolicyService,
    private readonly loadShedding: LoadSheddingService,
    private readonly metrics: ScalabilityMetricsService,
    @Inject(CONTENT_SUPPLEMENT_PORT)
    private readonly contentSupplement: ContentSupplementPort,
  ) {}

  async resolveSlotPayload(params: {
    path: string;
    slotId: string;
    query: QueryMap;
    localeContext: LocaleContext;
    requestId: string;
    ifNoneMatch?: string;
    response?: FastifyReply;
  }): Promise<SlotPayloadModel> {
    return this.loadShedding.run(
      "slot",
      {
        maxInflight: SLOT_MAX_INFLIGHT,
        retryAfterSeconds: SLOT_RETRY_AFTER_SECONDS,
      },
      async () => {
        const {
          path,
          slotId,
          query,
          localeContext,
          requestId,
          ifNoneMatch,
          response,
        } = params;
        const start = performance.now();
        if (slotId === "slot:pdp-recommendations") {
          const handle = query.productHandle ?? extractProductHandle(path);
          if (!handle) {
            throw new NotFoundException(`Invalid product path "${path}"`);
          }

          const page = await this.pageData.getProductPage(
            handle,
            localeContext,
          );
          if (!page) throw new NotFoundException();

          const payload: SlotPayloadModel = {
            slotId,
            rendererKey: "page.pdp-recommendations",
            props: {
              products: page.recommendations,
            },
            presentation: presentationFromQuery(query),
            revalidateTags: [`products:${handle}:recs`, "products"],
            staleAfterSeconds: 120,
            slotVersion: this.i18n.getTranslationVersion(),
          };
          return this.finalize(
            payload,
            localeContext,
            localeContext.language,
            requestId,
            start,
            ifNoneMatch,
            response,
          );
        }

        if (slotId === "slot:pdp-reviews") {
          if (DEBUG_PDP_REVIEWS_DELAY_MS > 0) {
            await sleep(DEBUG_PDP_REVIEWS_DELAY_MS);
          }
          const handle = query.productHandle ?? extractProductHandle(path);
          if (!handle) {
            throw new NotFoundException(`Invalid product path "${path}"`);
          }

          const payload: SlotPayloadModel = {
            slotId,
            rendererKey: "page.pdp-reviews",
            props: {
              reviews: await this.contentSupplement.getReviews(
                handle,
                localeContext.locale,
              ),
            },
            presentation: presentationFromQuery(query),
            revalidateTags: [`reviews:${handle}`],
            staleAfterSeconds: 60,
            slotVersion: this.i18n.getTranslationVersion(),
          };
          return this.finalize(
            payload,
            localeContext,
            localeContext.language,
            requestId,
            start,
            ifNoneMatch,
            response,
          );
        }

        if (slotId === "slot:pdp-faq") {
          const handle = query.productHandle ?? extractProductHandle(path);
          if (!handle) {
            throw new NotFoundException(`Invalid product path "${path}"`);
          }

          const payload: SlotPayloadModel = {
            slotId,
            rendererKey: "page.pdp-faq",
            props: {
              items: await this.contentSupplement.getFaq(localeContext.locale),
            },
            presentation: presentationFromQuery(query),
            revalidateTags: [`faq:${handle}`],
            staleAfterSeconds: 300,
            slotVersion: this.i18n.getTranslationVersion(),
          };
          return this.finalize(
            payload,
            localeContext,
            localeContext.language,
            requestId,
            start,
            ifNoneMatch,
            response,
          );
        }

        if (slotId === "slot:search-products") {
          const { sortKey, reverse } = getSorting(query);
          const searchPage = await this.pageData.getSearchPage(
            query.q,
            sortKey,
            reverse,
            localeContext,
          );
          const payload: SlotPayloadModel = {
            slotId,
            rendererKey: "page.search-products",
            props: {
              products: searchPage.products,
            },
            presentation: presentationFromQuery(query),
            revalidateTags: ["products"],
            staleAfterSeconds: 60,
            slotVersion: this.i18n.getTranslationVersion(),
          };
          return this.finalize(
            payload,
            localeContext,
            localeContext.language,
            requestId,
            start,
            ifNoneMatch,
            response,
          );
        }

        throw new NotFoundException(`Unknown slot "${slotId}"`);
      },
    );
  }

  private finalize(
    payload: SlotPayloadModel,
    localeContext: LocaleContext,
    language: string,
    requestId: string,
    start: number,
    ifNoneMatch?: string,
    response?: FastifyReply,
  ): SlotPayloadModel {
    const totalMs = performance.now() - start;
    const normalizedProps = this.linkLocalization.normalizePathFields(
      payload.props,
      localeContext,
    );
    if (normalizedProps.audit.nonCompliantLinkCount > 0) {
      this.metrics.recordError("link_localization_violation");
      this.logger.warn(
        JSON.stringify({
          type: "link_localization_violation",
          requestId,
          slotId: payload.slotId,
          language: normalizedProps.audit.language,
          defaultLanguage: normalizedProps.audit.defaultLanguage,
          nonCompliantLinkCount: normalizedProps.audit.nonCompliantLinkCount,
          normalizedLinkCount: normalizedProps.audit.normalizedLinkCount ?? 0,
          samplePaths: normalizedProps.audit.samplePaths ?? [],
        }),
      );
    }
    const revalidateTags = withLanguageScopedTags(
      payload.revalidateTags,
      language,
    );
    const withMeta: SlotPayloadModel = {
      ...payload,
      props: normalizedProps.value,
      revalidateTags,
      requestId,
      timings:
        process.env.INCLUDE_TIMINGS_IN_RESPONSE === "true"
          ? { totalMs }
          : undefined,
    };

    const etag = weakEtag(withMeta);
    const cacheHints = this.cachePolicy.getSlotCacheHints(
      payload.staleAfterSeconds,
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

    this.metrics.recordSlot({
      slotId: payload.slotId,
      status: 200,
      latencyMs: totalMs,
    });

    if (ifNoneMatch && ifNoneMatch === etag) {
      response?.status(304);
      return undefined as unknown as SlotPayloadModel;
    }

    return withMeta;
  }
}

function extractProductHandle(path: string): string | undefined {
  const parts = path.split("/").filter(Boolean);
  return parts.at(-1);
}

function parseBoolean(raw: string | undefined): boolean | undefined {
  if (raw === undefined) return undefined;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

function getSorting(query: QueryMap): {
  sortKey?: string;
  reverse?: boolean;
} {
  const explicitSortKey = query.sortKey;
  const explicitReverse = parseBoolean(query.reverse);

  if (explicitSortKey !== undefined || explicitReverse !== undefined) {
    return {
      sortKey: explicitSortKey,
      reverse: explicitReverse,
    };
  }

  switch (query.sort) {
    case "trending-desc":
      return { sortKey: "BEST_SELLING", reverse: false };
    case "latest-desc":
      return { sortKey: "CREATED_AT", reverse: true };
    case "price-asc":
      return { sortKey: "PRICE", reverse: false };
    case "price-desc":
      return { sortKey: "PRICE", reverse: true };
    default:
      return { sortKey: undefined, reverse: false };
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function weakEtag(input: unknown): string {
  const json = JSON.stringify(input);
  const digest = createHash("sha256").update(json).digest("base64url");
  return `W/"${digest}"`;
}

function presentationFromQuery(query: QueryMap): SlotPresentation | undefined {
  const variantKey = query.variantKey;
  if (!variantKey) {
    return undefined;
  }

  const density =
    query.density === "compact" || query.density === "comfortable"
      ? query.density
      : undefined;

  return {
    variantKey,
    layoutKey: query.layoutKey,
    density,
  };
}
