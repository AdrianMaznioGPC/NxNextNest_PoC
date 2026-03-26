import type {
  LinkLocalizationAudit,
  SlotManifest,
} from "@commerce/shared-types";
import { Injectable, Logger } from "@nestjs/common";
import { LinkLocalizationPolicyService } from "../../slug/link-localization-policy.service";
import { ScalabilityMetricsService } from "../../system/scalability-metrics.service";
import type { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { BootstrapStage } from "../bootstrap/bootstrap-stage.interface";
import { PersonalizationStage } from "./personalization.stage";

/**
 * Stage 7: Link Localization
 *
 * Responsibilities:
 * - Normalize path fields in content nodes (ensure proper language prefix)
 * - Normalize path fields in personalized slots
 * - Audit page-level path fields (path, requestedPath, resolvedPath, redirectTo)
 * - Merge all audits and log violations
 * - Record metrics for non-compliant links
 * - Store final normalized slots in context
 */
@Injectable()
export class LinkLocalizationStage implements BootstrapStage {
  readonly name = "link-localization";

  private readonly logger = new Logger(LinkLocalizationStage.name);

  // Store normalized slots and audit in context
  private normalizedSlotsMap = new WeakMap<BootstrapContext, SlotManifest[]>();
  private auditMap = new WeakMap<BootstrapContext, LinkLocalizationAudit>();

  constructor(
    private readonly linkLocalization: LinkLocalizationPolicyService,
    private readonly metrics: ScalabilityMetricsService,
    private readonly personalizationStage: PersonalizationStage,
  ) {}

  execute(ctx: BootstrapContext): void {
    if (!ctx.localeContext || !ctx.route) {
      throw new Error(
        "LinkLocalizationStage requires localeContext and route to be set",
      );
    }

    // Normalize content paths
    const normalizedContent = this.linkLocalization.normalizePathFields(
      ctx.content ?? [],
      ctx.localeContext,
    );

    // Update context with normalized content
    ctx.content = normalizedContent.value;

    // Normalize slot paths
    const personalizedSlots =
      this.personalizationStage.getPersonalizedSlots(ctx);
    const normalizedSlots = this.linkLocalization.normalizePathFields(
      personalizedSlots,
      ctx.localeContext,
    );

    // Store normalized slots in context
    ctx.slots = normalizedSlots.value;
    this.normalizedSlotsMap.set(ctx, normalizedSlots.value);

    // Audit page-level path fields
    const pageAudit = this.auditPagePathFields(ctx);

    // Merge all audits
    const combinedAudit = this.mergeLocalizationAudit(
      normalizedContent.audit,
      normalizedSlots.audit,
      pageAudit,
    );

    // Store audit in context
    ctx.localizationAudit = combinedAudit;
    this.auditMap.set(ctx, combinedAudit);

    // Log violations
    if (combinedAudit.nonCompliantLinkCount > 0) {
      this.metrics.recordError("link_localization_violation");
      this.logger.warn(
        JSON.stringify({
          type: "link_localization_violation",
          requestId: ctx.requestId,
          routeKind: ctx.route.routeKind,
          language: combinedAudit.language,
          defaultLanguage: combinedAudit.defaultLanguage,
          nonCompliantLinkCount: combinedAudit.nonCompliantLinkCount,
          normalizedLinkCount: combinedAudit.normalizedLinkCount ?? 0,
          samplePaths: combinedAudit.samplePaths ?? [],
        }),
      );
    }
  }

  /**
   * Get normalized slots from context (used by response builder).
   */
  getNormalizedSlots(ctx: BootstrapContext): SlotManifest[] {
    return this.normalizedSlotsMap.get(ctx) ?? [];
  }

  /**
   * Get localization audit from context (used by response builder).
   */
  getAudit(ctx: BootstrapContext): LinkLocalizationAudit | undefined {
    return this.auditMap.get(ctx);
  }

  /**
   * Audit page-level path fields for localization compliance.
   */
  private auditPagePathFields(ctx: BootstrapContext): LinkLocalizationAudit {
    if (!ctx.localeContext || !ctx.route) {
      return {
        language: "en",
        defaultLanguage: "en",
        nonCompliantLinkCount: 0,
      };
    }

    const samples = new Set<string>();
    let nonCompliantLinkCount = 0;

    const candidates = [
      ctx.route.resolvedPath,
      ctx.route.requestedPath,
      ctx.redirectTo,
    ];

    for (const candidate of candidates) {
      if (!candidate) {
        continue;
      }
      const result = this.linkLocalization.assertPrefixPolicy(
        candidate,
        ctx.localeContext,
      );
      if (!result.compliant) {
        nonCompliantLinkCount += 1;
        if (samples.size < 5) {
          samples.add(candidate);
        }
      }
    }

    return {
      language: ctx.localeContext.language,
      defaultLanguage: this.linkLocalization.getDomainDefaultLanguage(
        ctx.localeContext.domain,
      ),
      nonCompliantLinkCount,
      samplePaths: [...samples],
    };
  }

  /**
   * Merge multiple localization audits into one.
   */
  private mergeLocalizationAudit(
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
}
