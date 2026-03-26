import type { LocaleContext, PageBootstrapModel } from "@commerce/shared-types";
import { Injectable, Logger } from "@nestjs/common";
import { performance } from "node:perf_hooks";
import { I18nService } from "../i18n/i18n.service";
import { LoadSheddingService } from "../system/load-shedding.service";
import { ScalabilityMetricsService } from "../system/scalability-metrics.service";
import { BootstrapContext } from "./bootstrap/bootstrap-context.model";
import { BootstrapResponseBuilder } from "./bootstrap/bootstrap-response.builder";
import { BootstrapStageFactory } from "./bootstrap/bootstrap-stage.factory";
import type { BootstrapStage } from "./bootstrap/bootstrap-stage.interface";

const BOOTSTRAP_MAX_INFLIGHT = Number(
  process.env.BOOTSTRAP_MAX_INFLIGHT ?? "256",
);
const BOOTSTRAP_RETRY_AFTER_SECONDS = Number(
  process.env.BOOTSTRAP_RETRY_AFTER_SECONDS ?? "2",
);

@Injectable()
export class BootstrapOrchestratorService {
  private readonly logger = new Logger(BootstrapOrchestratorService.name);
  private readonly stages: BootstrapStage[];

  constructor(
    private readonly stageFactory: BootstrapStageFactory,
    private readonly responseBuilder: BootstrapResponseBuilder,
    private readonly i18n: I18nService,
    private readonly loadShedding: LoadSheddingService,
    private readonly metrics: ScalabilityMetricsService,
  ) {
    this.stages = this.stageFactory.createPipeline();
  }

  async buildBootstrap(params: {
    path: string;
    query: Record<string, string | undefined>;
    requestedLocaleContext?: Partial<LocaleContext>;
    requestId: string;
    cookieHeader?: string;
  }): Promise<PageBootstrapModel> {
    const { path, query, requestedLocaleContext, requestId, cookieHeader } =
      params;
    return this.loadShedding.run(
      "bootstrap",
      {
        maxInflight: BOOTSTRAP_MAX_INFLIGHT,
        retryAfterSeconds: BOOTSTRAP_RETRY_AFTER_SECONDS,
      },
      async () => {
        const totalStart = performance.now();
        const requestedContext = this.i18n.resolveLocaleContext(
          requestedLocaleContext,
        );

        // Create context for pipeline
        const ctx = new BootstrapContext({
          requestedPath: path,
          query: { ...query },
          requestId,
          cookieHeader,
        });
        ctx.localeContext = requestedContext;

        // Execute stage pipeline
        const stageTimings: Array<{ name: string; durationMs: number }> = [];
        const routeStart = performance.now();
        let assemblyMs = 0;

        for (const stage of this.stages) {
          // Check if stage should be skipped
          if (ctx.shouldStopProcessing()) {
            break;
          }

          // Check conditional execution
          if (stage.shouldRun && !stage.shouldRun(ctx)) {
            continue;
          }

          // Execute stage and track timing
          const stageStart = performance.now();
          await stage.execute(ctx);
          const stageDuration = performance.now() - stageStart;
          stageTimings.push({ name: stage.name, durationMs: stageDuration });

          // Track route and assembly timings for backward compatibility
          if (stage.name === "route-recognition") {
            // routeMs will be tracked separately below
          }
          if (stage.name === "page-assembly") {
            assemblyMs = stageDuration;
          }
        }

        const routeMs = performance.now() - routeStart;
        const totalMs = performance.now() - totalStart;

        // Get final route kind (after route recognition)
        const routeKind =
          ctx.route?.routeKind === "unknown" ? undefined : ctx.route?.routeKind;

        // Record metrics
        this.metrics.recordBootstrap({
          routeKind: routeKind ?? "unknown",
          assemblerKey: ctx.assemblerKey,
          status: ctx.status ?? 404,
          latencyMs: totalMs,
        });

        // Log completion
        this.logger.log(
          JSON.stringify({
            type: "bootstrap",
            requestId,
            routeKind,
            matchedRuleId: ctx.matchedRuleId,
            status: ctx.status,
            merchandising: {
              mode: ctx.merchandising?.mode,
              profileId: ctx.merchandising?.profileId,
              defaultSortApplied: ctx.defaultSortApplied,
              defaultSortSlug: ctx.merchandising?.defaultSortSlug,
            },
            timings: { routeMs, assemblyMs, totalMs },
            stages: stageTimings,
          }),
        );

        // Build final response
        return this.responseBuilder.build(ctx, {
          routeKind,
          timings: { routeMs, assemblyMs, totalMs, stageTimings },
        });
      },
    );
  }
}
