import type { PageBootstrapModel } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { I18nService } from "../../i18n/i18n.service";
import { LinkLocalizationPolicyService } from "../../slug/link-localization-policy.service";
import { CachePolicyService } from "../../system/cache-policy.service";
import type { BootstrapContext } from "./bootstrap-context.model";

const INCLUDE_TIMINGS_IN_RESPONSE =
  process.env.INCLUDE_TIMINGS_IN_RESPONSE === "true";
const INCLUDE_LINK_LOCALIZATION_AUDIT =
  process.env.INCLUDE_LINK_LOCALIZATION_AUDIT === "true";

/**
 * Builder service that constructs the final PageBootstrapModel response
 * from a fully-populated BootstrapContext.
 *
 * Responsibilities:
 * - Assemble page, shell, and slots sections
 * - Resolve i18n messages and namespaces
 * - Compute cache hints
 * - Localize experience paths
 * - Include optional timings and audits
 */
@Injectable()
export class BootstrapResponseBuilder {
  constructor(
    private readonly i18n: I18nService,
    private readonly linkLocalization: LinkLocalizationPolicyService,
    private readonly cachePolicy: CachePolicyService,
  ) {}

  /**
   * Build the final PageBootstrapModel response from the context.
   * Context must have all required fields populated by stages.
   */
  build(
    ctx: BootstrapContext,
    params: {
      routeKind?: string;
      timings: {
        routeMs: number;
        assemblyMs: number;
        totalMs: number;
        stageTimings: Array<{ name: string; durationMs: number }>;
      };
    },
  ): PageBootstrapModel {
    const localeContext = ctx.localeContext!;
    const experience = ctx.experience!;
    const merchandising = ctx.merchandising!;

    // Handle 404 response
    if (ctx.status === 404) {
      return this.build404Response(ctx, params);
    }

    // Handle 301 redirect response
    if (ctx.status === 301) {
      return this.build301Response(ctx, params);
    }

    // Build 200 success response
    const cacheHints = this.cachePolicy.getBootstrapCacheHints(
      params.routeKind ?? "unknown",
      ctx.status!,
    );

    // Resolve i18n namespaces from slots
    const resolvedModel = {
      slots: ctx.slots ?? [],
      content: ctx.content ?? [],
    } as any;
    const namespaces = this.i18n.resolveNamespaces(resolvedModel);
    const messagePayload = this.i18n.getMessages(
      localeContext.locale,
      namespaces,
    );

    return {
      page: {
        schemaVersion: 2,
        path: ctx.route!.resolvedPath,
        status: ctx.status!,
        routeKind: params.routeKind as any,
        requestedPath: ctx.requestedPath,
        resolvedPath: ctx.route!.resolvedPath,
        canonicalPath: ctx.route!.canonicalPath,
        redirectTo: ctx.redirectTo,
        seo: ctx.seo!,
        localeContext,
        canonicalUrl: `https://${localeContext.domain}${ctx.route!.resolvedPath}`,
        alternates: this.i18n.buildAlternates(ctx.route!.canonicalPath),
        translationVersion:
          ctx.translationVersion || messagePayload.translationVersion,
        translationSource: "bff-bootstrap",
        matchedRuleId: ctx.matchedRuleId,
        assemblerKey: ctx.assemblerKey,
        assemblyVersion: ctx.assemblyVersion,
        requestId: ctx.requestId,
        timings: INCLUDE_TIMINGS_IN_RESPONSE
          ? {
              routeMs: params.timings.routeMs,
              assemblyMs: params.timings.assemblyMs,
              totalMs: params.timings.totalMs,
            }
          : undefined,
        cacheHints,
        localizationAudit: INCLUDE_LINK_LOCALIZATION_AUDIT
          ? ctx.localizationAudit
          : undefined,
        merchandisingApplied: {
          mode: merchandising.mode,
          defaultSortSlug: ctx.defaultSortApplied
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
      slots: ctx.slots ?? [],
    };
  }

  /**
   * Build a 404 not found response.
   */
  private build404Response(
    ctx: BootstrapContext,
    params: {
      timings: {
        routeMs: number;
        assemblyMs: number;
        totalMs: number;
      };
    },
  ): PageBootstrapModel {
    const localeContext = ctx.localeContext!;
    const experience = ctx.experience!;
    const merchandising = ctx.merchandising!;

    const cacheHints = this.cachePolicy.getBootstrapCacheHints("unknown", 404);
    const resolvedModel = { slots: [], content: [] } as any;
    const namespaces = this.i18n.resolveNamespaces(resolvedModel);
    const messagePayload = this.i18n.getMessages(
      localeContext.locale,
      namespaces,
    );

    return {
      page: {
        schemaVersion: 2,
        path: ctx.route?.resolvedPath ?? ctx.requestedPath,
        status: 404,
        routeKind: undefined,
        requestedPath: ctx.requestedPath,
        resolvedPath: ctx.route?.resolvedPath ?? ctx.requestedPath,
        canonicalPath: ctx.route?.canonicalPath,
        seo: ctx.seo ?? {
          title: this.i18n.t(localeContext.locale, "page.notFoundTitle"),
          description: this.i18n.t(
            localeContext.locale,
            "page.notFoundDescription",
          ),
        },
        localeContext,
        canonicalUrl: `https://${localeContext.domain}${ctx.route?.resolvedPath ?? ctx.requestedPath}`,
        alternates: this.i18n.buildAlternates(
          ctx.route?.canonicalPath ?? ctx.requestedPath,
        ),
        translationVersion:
          ctx.translationVersion || messagePayload.translationVersion,
        translationSource: "bff-bootstrap",
        matchedRuleId: ctx.matchedRuleId,
        assemblerKey: ctx.assemblerKey,
        assemblyVersion: ctx.assemblyVersion,
        requestId: ctx.requestId,
        timings: INCLUDE_TIMINGS_IN_RESPONSE
          ? {
              routeMs: params.timings.routeMs,
              assemblyMs: params.timings.assemblyMs,
              totalMs: params.timings.totalMs,
            }
          : undefined,
        cacheHints,
        merchandisingApplied: {
          mode: merchandising?.mode ?? "default",
          defaultSortSlug: undefined,
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
          merchandisingMode: merchandising?.mode ?? "default",
          merchandisingProfileId: merchandising?.profileId ?? "default",
          layoutKey: experience.layoutKey,
        },
      },
      slots: [],
    };
  }

  /**
   * Build a 301 redirect response.
   */
  private build301Response(
    ctx: BootstrapContext,
    params: {
      timings: {
        routeMs: number;
        assemblyMs: number;
        totalMs: number;
      };
    },
  ): PageBootstrapModel {
    const localeContext = ctx.localeContext!;
    const experience = ctx.experience!;
    const merchandising = ctx.merchandising!;

    const cacheHints = this.cachePolicy.getBootstrapCacheHints("unknown", 301);
    const resolvedModel = { slots: [], content: [] } as any;
    const namespaces = this.i18n.resolveNamespaces(resolvedModel);
    const messagePayload = this.i18n.getMessages(
      localeContext.locale,
      namespaces,
    );

    return {
      page: {
        schemaVersion: 2,
        path: ctx.route!.resolvedPath,
        status: 301,
        routeKind: undefined,
        requestedPath: ctx.requestedPath,
        resolvedPath: ctx.route!.resolvedPath,
        canonicalPath: ctx.route!.canonicalPath,
        redirectTo: ctx.redirectTo,
        seo: ctx.seo ?? {
          title: this.i18n.t(localeContext.locale, "page.homeTitle"),
          description: this.i18n.t(
            localeContext.locale,
            "page.homeDescription",
          ),
        },
        localeContext,
        canonicalUrl: `https://${localeContext.domain}${ctx.route!.resolvedPath}`,
        alternates: this.i18n.buildAlternates(ctx.route!.canonicalPath),
        translationVersion:
          ctx.translationVersion || messagePayload.translationVersion,
        translationSource: "bff-bootstrap",
        matchedRuleId: ctx.matchedRuleId,
        assemblerKey: ctx.assemblerKey,
        assemblyVersion: ctx.assemblyVersion,
        requestId: ctx.requestId,
        timings: INCLUDE_TIMINGS_IN_RESPONSE
          ? {
              routeMs: params.timings.routeMs,
              assemblyMs: params.timings.assemblyMs,
              totalMs: params.timings.totalMs,
            }
          : undefined,
        cacheHints,
        merchandisingApplied: {
          mode: merchandising.mode,
          defaultSortSlug: undefined,
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
      slots: [],
    };
  }
}
