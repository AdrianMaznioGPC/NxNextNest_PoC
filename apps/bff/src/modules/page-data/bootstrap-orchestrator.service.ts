import type {
  LinkLocalizationAudit,
  LocaleContext,
  PageBootstrapModel,
  PageContentNode,
  PageSeo,
  ResolvedPageModel,
  ResolvedPageSlot,
} from "@commerce/shared-types";
import { performance } from "node:perf_hooks";
import { Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { I18nService } from "../i18n/i18n.service";
import { PageAssemblerRegistry } from "./assemblers/page-assembler.registry";
import { RouteRecognitionService } from "./routing/route-recognition.service";
import type { ResolvedRouteDescriptor } from "./routing/route-rule.types";
import { SlotPlannerService } from "./slot-planner.service";
import { CachePolicyService } from "../system/cache-policy.service";
import { LoadSheddingService } from "../system/load-shedding.service";
import { ExperienceResolverService } from "../experience/experience-resolver.service";
import {
  ResilienceService,
  TimeoutPolicyError,
} from "../system/resilience.service";
import { ScalabilityMetricsService } from "../system/scalability-metrics.service";
import type { ResolvedExperienceProfile } from "../experience/experience-profile.types";
import { LinkLocalizationPolicyService } from "../slug/link-localization-policy.service";
import { MerchandisingResolverService } from "../merchandising/merchandising-resolver.service";
import type { ResolvedMerchandisingProfile } from "../merchandising/merchandising-profile.types";

const ASSEMBLY_VERSION = "v1";
const INCLUDE_TIMINGS_IN_RESPONSE =
  process.env.INCLUDE_TIMINGS_IN_RESPONSE === "true";
const BOOTSTRAP_MAX_INFLIGHT = Number(
  process.env.BOOTSTRAP_MAX_INFLIGHT ?? "256",
);
const BOOTSTRAP_RETRY_AFTER_SECONDS = Number(
  process.env.BOOTSTRAP_RETRY_AFTER_SECONDS ?? "2",
);
const INCLUDE_LINK_LOCALIZATION_AUDIT =
  process.env.INCLUDE_LINK_LOCALIZATION_AUDIT === "true";

const ASSEMBLER_BUDGET_MS: Record<string, number> = {
  home: 200,
  "category-list": 300,
  "category-detail": 300,
  "product-detail": 350,
  search: 300,
  cart: 150,
  "content-page": 200,
};

@Injectable()
export class BootstrapOrchestratorService {
  private readonly logger = new Logger(BootstrapOrchestratorService.name);

  constructor(
    private readonly routeRecognition: RouteRecognitionService,
    private readonly assemblerRegistry: PageAssemblerRegistry,
    private readonly i18n: I18nService,
    private readonly slotPlanner: SlotPlannerService,
    private readonly cachePolicy: CachePolicyService,
    private readonly loadShedding: LoadSheddingService,
    private readonly experience: ExperienceResolverService,
    private readonly resilience: ResilienceService,
    private readonly metrics: ScalabilityMetricsService,
    private readonly linkLocalization: LinkLocalizationPolicyService,
    private readonly merchandising: MerchandisingResolverService,
  ) {}

  async buildBootstrap(params: {
    path: string;
    query: Record<string, string | undefined>;
    requestedLocaleContext?: Partial<LocaleContext>;
    requestId: string;
  }): Promise<PageBootstrapModel> {
    const { path, query, requestedLocaleContext, requestId } = params;
    return this.loadShedding.run(
      "bootstrap",
      {
        maxInflight: BOOTSTRAP_MAX_INFLIGHT,
        retryAfterSeconds: BOOTSTRAP_RETRY_AFTER_SECONDS,
      },
      async () => {
        const totalStart = performance.now();
        const requestedContext =
          this.i18n.resolveLocaleContext(requestedLocaleContext);
        const routeStart = performance.now();
        const route = this.routeRecognition.recognize(path, requestedContext);
        const routeMs = performance.now() - routeStart;
        const localeContext = route.localeContext;
        const routeKindForExperience =
          route.routeKind === "unknown" ? undefined : route.routeKind;
        const experience = this.experience.resolve({
          localeContext,
          routeKind: routeKindForExperience,
        });
        const merchandising = this.merchandising.resolve({
          storeKey: experience.storeKey,
          routeKind: routeKindForExperience,
          language: localeContext.language,
        });
        const {
          query: queryWithMerchandising,
          defaultSortApplied,
        } = this.merchandising.applyDefaultSort(query, merchandising);
        this.metrics.recordMerchandising({
          storeKey: experience.storeKey,
          routeKind: route.routeKind,
          language: localeContext.language,
          mode: merchandising.mode,
          profileId: merchandising.profileId,
        });

        const assemblyStart = performance.now();
        const resolvedModel = await this.resolvePage({
          route,
          query: queryWithMerchandising,
          localeContext,
          experience,
          merchandising,
          requestId,
        });
        const assemblyMs = performance.now() - assemblyStart;
        const totalMs = performance.now() - totalStart;

        const cacheHints = this.cachePolicy.getBootstrapCacheHints(
          resolvedModel.routeKind,
          resolvedModel.status,
        );
        const namespaces = this.i18n.resolveNamespaces(resolvedModel);
        const messagePayload = this.i18n.getMessages(
          localeContext.locale,
          namespaces,
        );
        const plannedSlots = this.slotPlanner.plan({
          resolved: resolvedModel,
          path: route.resolvedPath,
          query: queryWithMerchandising,
          localeContext,
          route,
        });
        const experienceSlots = this.experience.applyToSlots(
          plannedSlots,
          experience,
        );
        const slots = this.merchandising.applyToSlots(
          experienceSlots,
          merchandising,
        );
        const normalizedContent = this.linkLocalization.normalizePathFields(
          resolvedModel.content ?? [],
          localeContext,
        );
        const normalizedSlots = this.linkLocalization.normalizePathFields(
          slots,
          localeContext,
        );
        const localizationAudit = mergeLocalizationAudit(
          normalizedContent.audit,
          normalizedSlots.audit,
          auditPagePathFields(
            {
              path: resolvedModel.path,
              requestedPath: resolvedModel.requestedPath,
              resolvedPath: resolvedModel.resolvedPath,
              redirectTo: resolvedModel.redirectTo,
            },
            localeContext,
            this.linkLocalization,
          ),
        );
        if (localizationAudit.nonCompliantLinkCount > 0) {
          this.metrics.recordError("link_localization_violation");
          this.logger.warn(
            JSON.stringify({
              type: "link_localization_violation",
              requestId,
              routeKind: resolvedModel.routeKind,
              language: localizationAudit.language,
              defaultLanguage: localizationAudit.defaultLanguage,
              nonCompliantLinkCount: localizationAudit.nonCompliantLinkCount,
              normalizedLinkCount: localizationAudit.normalizedLinkCount ?? 0,
              samplePaths: localizationAudit.samplePaths ?? [],
            }),
          );
        }

        this.metrics.recordBootstrap({
          routeKind: resolvedModel.routeKind ?? "unknown",
          assemblerKey: resolvedModel.assemblerKey,
          status: resolvedModel.status,
          latencyMs: totalMs,
        });
        this.logger.log(
          JSON.stringify({
            type: "bootstrap",
            requestId,
            routeKind: resolvedModel.routeKind,
            matchedRuleId: resolvedModel.matchedRuleId,
            status: resolvedModel.status,
            merchandising: {
              mode: merchandising.mode,
              profileId: merchandising.profileId,
              defaultSortApplied,
              defaultSortSlug: merchandising.defaultSortSlug,
            },
            timings: { routeMs, assemblyMs, totalMs },
          }),
        );

        return {
          page: {
            schemaVersion: resolvedModel.schemaVersion,
            path: resolvedModel.path,
            status: resolvedModel.status,
            routeKind: resolvedModel.routeKind,
            requestedPath: resolvedModel.requestedPath,
            resolvedPath: resolvedModel.resolvedPath,
            canonicalPath: resolvedModel.canonicalPath,
            redirectTo: resolvedModel.redirectTo,
            seo: resolvedModel.seo,
            localeContext,
            canonicalUrl: resolvedModel.canonicalUrl,
            alternates: resolvedModel.alternates,
            translationVersion:
              resolvedModel.translationVersion || messagePayload.translationVersion,
            translationSource: "bff-bootstrap",
            matchedRuleId: resolvedModel.matchedRuleId,
            assemblerKey: resolvedModel.assemblerKey,
            assemblyVersion: resolvedModel.assemblyVersion,
            requestId,
            timings: INCLUDE_TIMINGS_IN_RESPONSE
              ? { routeMs, assemblyMs, totalMs }
              : undefined,
            cacheHints,
            localizationAudit: INCLUDE_LINK_LOCALIZATION_AUDIT
              ? localizationAudit
              : undefined,
            merchandisingApplied: {
              mode: merchandising.mode,
              defaultSortSlug: defaultSortApplied
                ? merchandising.defaultSortSlug
                : undefined,
            },
          },
          shell: {
            namespaces,
            messages: messagePayload.messages,
            experience: {
              storeKey: experience.storeKey,
              experienceProfileId: experience.experienceProfileId,
              storeFlagIconSrc: experience.storeFlagIconSrc,
              storeFlagIconLabel: experience.storeFlagIconLabel,
              themeKey: experience.themeKey,
              themeRevision: experience.themeRevision,
              themeTokenPack: experience.themeTokenPack,
              language: experience.language,
              defaultLanguage: experience.defaultLanguage,
              supportedLanguages: experience.supportedLanguages,
              cartUxMode: experience.cartUxMode,
              cartPath: this.linkLocalization.localizeInternalPath(
                experience.cartPath,
                localeContext,
              ),
              openCartOnAdd: experience.openCartOnAdd,
              merchandisingMode: merchandising.mode,
              merchandisingProfileId: merchandising.profileId,
              layoutKey: experience.layoutKey,
            },
          },
          slots: normalizedSlots.value,
        };
      },
    );
  }

  private async resolvePage(params: {
    route: ResolvedRouteDescriptor;
    query: Record<string, string | undefined>;
    localeContext: LocaleContext;
    experience: Pick<ResolvedExperienceProfile, "cartUxMode">;
    merchandising: Pick<
      ResolvedMerchandisingProfile,
      "mode" | "profileId" | "defaultSortSlug"
    >;
    requestId: string;
  }): Promise<ResolvedPageModel> {
    const { route, query, localeContext, experience, merchandising, requestId } =
      params;

    if (route.status === 404 || route.routeKind === "unknown") {
      return this.notFound(route, localeContext);
    }

    if (route.routeKind === "cart" && experience.cartUxMode !== "page") {
      this.metrics.recordError("route:cart:blocked_by_mode");
      this.logger.debug(
        JSON.stringify({
          type: "cart_route_blocked_by_mode",
          requestId,
          requestedPath: route.requestedPath,
          resolvedPath: route.resolvedPath,
          cartUxMode: experience.cartUxMode,
          locale: localeContext.locale,
          domain: localeContext.domain,
        }),
      );
      return this.notFound(route, localeContext);
    }

    if (route.status === 301 && route.redirectTo) {
      return this.redirect(route, localeContext);
    }

    const assembler = this.assemblerRegistry.getAssembler(route.routeKind);
    if (!assembler) {
      return this.notFound(route, localeContext);
    }

    const budgetMs = ASSEMBLER_BUDGET_MS[route.routeKind] ?? 300;
    let assembly;
    try {
      assembly = await this.resilience.execute(
        `assembler:${route.routeKind}`,
        () =>
          assembler.assemble({
            route,
            query,
            localeContext,
            merchandising,
          }),
        {
          timeoutMs: budgetMs,
          retries: 0,
          maxConcurrent: 128,
        },
      );
    } catch (error) {
      this.metrics.recordError(`assembler:${route.routeKind}`);
      if (error instanceof TimeoutPolicyError) {
        this.logger.warn(
          `Assembler timed out routeKind=${route.routeKind} budgetMs=${budgetMs}`,
        );
      } else {
        this.logger.error(
          `Assembler failed routeKind=${route.routeKind}`,
          error instanceof Error ? error.stack : String(error),
        );
      }
      return this.notFound(route, localeContext);
    }

    if (!assembly) {
      return this.notFound(route, localeContext);
    }

    const revalidateTags = withLanguageScopedTags(
      assembly.revalidateTags,
      localeContext.language,
    );

    return buildResolvedPage({
      route,
      status: 200,
      seo: assembly.seo,
      content: assembly.content,
      revalidateTags,
      localeContext,
      canonicalUrl: `https://${localeContext.domain}${route.resolvedPath}`,
      alternates: this.i18n.buildAlternates(route.canonicalPath),
      translationVersion: this.i18n.getTranslationVersion(),
      matchedRuleId: route.matchedRuleId,
      assemblerKey: assembly.assemblerKey,
      assemblyVersion: ASSEMBLY_VERSION,
    });
  }

  private redirect(
    route: ResolvedRouteDescriptor,
    localeContext: LocaleContext,
  ): ResolvedPageModel {
    return buildResolvedPage({
      route,
      status: 301,
      seo: {
        title: this.i18n.t(localeContext.locale, "page.homeTitle"),
        description: this.i18n.t(localeContext.locale, "page.homeDescription"),
      },
      content: [],
      revalidateTags: [],
      localeContext,
      canonicalUrl: `https://${localeContext.domain}${route.resolvedPath}`,
      alternates: this.i18n.buildAlternates(route.canonicalPath),
      translationVersion: this.i18n.getTranslationVersion(),
      redirectTo: route.redirectTo,
      matchedRuleId: route.matchedRuleId,
      assemblyVersion: ASSEMBLY_VERSION,
    });
  }

  private notFound(
    route: ResolvedRouteDescriptor,
    localeContext: LocaleContext,
  ): ResolvedPageModel {
    return buildResolvedPage({
      route,
      status: 404,
      seo: {
        title: this.i18n.t(localeContext.locale, "page.notFoundTitle"),
        description: this.i18n.t(localeContext.locale, "page.notFoundDescription"),
      },
      content: [],
      revalidateTags: [],
      localeContext,
      canonicalUrl: `https://${localeContext.domain}${route.resolvedPath}`,
      alternates: this.i18n.buildAlternates(route.canonicalPath),
      translationVersion: this.i18n.getTranslationVersion(),
      matchedRuleId: route.matchedRuleId,
      assemblyVersion: ASSEMBLY_VERSION,
    });
  }
}

function buildResolvedPage(params: {
  route: ResolvedRouteDescriptor;
  status: 200 | 301 | 404;
  seo: PageSeo;
  content: PageContentNode[];
  revalidateTags: string[];
  localeContext: LocaleContext;
  canonicalUrl: string;
  alternates: Record<string, string>;
  translationVersion: string;
  redirectTo?: string;
  matchedRuleId: string;
  assemblerKey?: string;
  assemblyVersion: string;
}): ResolvedPageModel {
  const slots = toSlots(params.content);
  const routeKind =
    params.route.routeKind === "unknown" ? undefined : params.route.routeKind;

  return {
    schemaVersion: 2,
    path: params.route.resolvedPath,
    status: params.status,
    routeKind,
    requestedPath: params.route.requestedPath,
    resolvedPath: params.route.resolvedPath,
    canonicalPath: params.route.canonicalPath,
    localeContext: params.localeContext,
    seo: params.seo,
    content: params.content,
    slots,
    revalidateTags: params.revalidateTags,
    canonicalUrl: params.canonicalUrl,
    alternates: params.alternates,
    translationVersion: params.translationVersion,
    redirectTo: params.redirectTo,
    matchedRuleId: params.matchedRuleId,
    assemblerKey: params.assemblerKey,
    assemblyVersion: params.assemblyVersion,
  };
}

function withLanguageScopedTags(tags: string[], language: string): string[] {
  const next = new Set(tags);
  for (const tag of tags) {
    if (tag === "products" || tag.startsWith("products:")) {
      next.add(`products:lang:${language}`);
    }
    if (tag === "collections" || tag.startsWith("collections:")) {
      next.add(`collections:lang:${language}`);
    }
    if (tag === "pages" || tag.startsWith("pages:")) {
      next.add(`pages:lang:${language}`);
    }
    if (tag === "menus" || tag.startsWith("menus:")) {
      next.add(`menus:lang:${language}`);
    }
  }
  return [...next];
}

function mergeLocalizationAudit(
  ...audits: Array<LinkLocalizationAudit>
): LinkLocalizationAudit {
  const samples = new Set<string>();
  let nonCompliantLinkCount = 0;
  let normalizedLinkCount = 0;
  const first = audits[0] ?? {
    language: "en",
    defaultLanguage: "en",
    nonCompliantLinkCount: 0,
  };

  for (const audit of audits) {
    nonCompliantLinkCount += audit.nonCompliantLinkCount;
    normalizedLinkCount += audit.normalizedLinkCount ?? 0;
    for (const sample of audit.samplePaths ?? []) {
      if (samples.size < 5) {
        samples.add(sample);
      }
    }
  }

  return {
    language: first.language,
    defaultLanguage: first.defaultLanguage,
    nonCompliantLinkCount,
    normalizedLinkCount,
    samplePaths: [...samples],
  };
}

function auditPagePathFields(
  page: {
    path?: string;
    requestedPath?: string;
    resolvedPath?: string;
    redirectTo?: string;
  },
  localeContext: LocaleContext,
  policy: LinkLocalizationPolicyService,
): LinkLocalizationAudit {
  const samples = new Set<string>();
  let nonCompliantLinkCount = 0;

  for (const candidate of [
    page.path,
    page.requestedPath,
    page.resolvedPath,
    page.redirectTo,
  ]) {
    if (!candidate) {
      continue;
    }
    const result = policy.assertPrefixPolicy(candidate, localeContext);
    if (!result.compliant) {
      nonCompliantLinkCount += 1;
      if (samples.size < 5) {
        samples.add(candidate);
      }
    }
  }

  return {
    language: localeContext.language,
    defaultLanguage: policy.getDomainDefaultLanguage(localeContext.domain),
    nonCompliantLinkCount,
    samplePaths: [...samples],
  };
}

function toSlots(content: PageContentNode[]): ResolvedPageSlot[] {
  return content.map((node, index) => {
    const rendererKey = rendererKeyForNode(node.type);
    const { type: _type, ...props } = node;
    const priority = node.type === "search-results" ? "deferred" : "critical";

    return {
      id: `${rendererKey}-${index}`,
      rendererKey,
      props,
      priority,
    };
  });
}

function rendererKeyForNode(type: PageContentNode["type"]): string {
  switch (type) {
    case "home":
      return "page.home";
    case "category-list":
      return "page.category-list";
    case "category-subcollections":
      return "page.category-subcollections";
    case "category-products":
      return "page.category-products";
    case "product-detail":
      return "page.product-detail";
    case "search-results":
      return "page.search-results";
    case "content-page":
      return "page.content-page";
    case "cart-page":
      return "page.cart";
  }
}
