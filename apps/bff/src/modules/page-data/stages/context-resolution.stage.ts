import { Injectable } from "@nestjs/common";
import type { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { BootstrapStage } from "../bootstrap/bootstrap-stage.interface";
import { ExperienceResolverService } from "../../experience/experience-resolver.service";
import { MerchandisingResolverService } from "../../merchandising/merchandising-resolver.service";
import { ScalabilityMetricsService } from "../../system/scalability-metrics.service";

/**
 * Stage 2: Context Resolution
 *
 * Responsibilities:
 * - Resolve experience profile (store, theme, cart mode, etc.)
 * - Resolve merchandising profile (sort, filter defaults)
 * - Apply merchandising defaults to query parameters
 * - Record merchandising metrics
 */
@Injectable()
export class ContextResolutionStage implements BootstrapStage {
  readonly name = "context-resolution";

  constructor(
    private readonly experience: ExperienceResolverService,
    private readonly merchandising: MerchandisingResolverService,
    private readonly metrics: ScalabilityMetricsService,
  ) {}

  async execute(ctx: BootstrapContext): Promise<void> {
    if (!ctx.route || !ctx.localeContext) {
      throw new Error(
        "ContextResolutionStage requires route and localeContext to be set",
      );
    }

    const routeKindForExperience =
      ctx.route.routeKind === "unknown" ? undefined : ctx.route.routeKind;

    // Resolve experience profile
    ctx.experience = await this.experience.resolve({
      localeContext: ctx.localeContext,
      routeKind: routeKindForExperience,
      query: ctx.query,
      cookieHeader: ctx.cookieHeader,
    });

    // Resolve merchandising profile
    ctx.merchandising = this.merchandising.resolve({
      storeKey: ctx.experience.storeKey,
      routeKind: routeKindForExperience,
      language: ctx.localeContext.language,
    });

    // Apply merchandising defaults (may mutate query)
    const { query: queryWithMerchandising, defaultSortApplied } =
      this.merchandising.applyDefaultSort(ctx.query, ctx.merchandising);

    ctx.query = queryWithMerchandising;
    ctx.defaultSortApplied = defaultSortApplied;

    // Record merchandising metrics
    this.metrics.recordMerchandising({
      storeKey: ctx.experience.storeKey,
      routeKind: ctx.route.routeKind,
      language: ctx.localeContext.language,
      mode: ctx.merchandising.mode,
      profileId: ctx.merchandising.profileId,
    });
  }
}
