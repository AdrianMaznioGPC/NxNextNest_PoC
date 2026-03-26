import { Inject, Injectable, Logger } from "@nestjs/common";
import { I18nService } from "../../i18n/i18n.service";
import {
  ResilienceService,
  TimeoutPolicyError,
} from "../../system/resilience.service";
import { ScalabilityMetricsService } from "../../system/scalability-metrics.service";
import { PageAssemblerRegistry } from "../assemblers/page-assembler.registry";
import type { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { BootstrapStage } from "../bootstrap/bootstrap-stage.interface";
import { withLanguageScopedTags } from "../cache-tag.utils";
import type { AssemblerBudgetConfig } from "../models/assembler-budget.config";
import { DefaultAssemblerBudgetConfig } from "../models/assembler-budget.config";

const ASSEMBLY_VERSION = "v1";

/**
 * Stage 4: Page Assembly
 *
 * Responsibilities:
 * - Validate cart route against experience cartUxMode
 * - Lookup appropriate page assembler by route kind
 * - Execute assembler with timeout/resilience policy
 * - Handle assembler failures (timeout, errors) → fallback to 404
 * - Populate context with assembly result (seo, content, tags)
 */
@Injectable()
export class PageAssemblyStage implements BootstrapStage {
  readonly name = "page-assembly";

  private readonly logger = new Logger(PageAssemblyStage.name);

  constructor(
    private readonly assemblerRegistry: PageAssemblerRegistry,
    private readonly resilience: ResilienceService,
    @Inject(DefaultAssemblerBudgetConfig)
    private readonly budget: AssemblerBudgetConfig,
    private readonly metrics: ScalabilityMetricsService,
    private readonly i18n: I18nService,
  ) {}

  async execute(ctx: BootstrapContext): Promise<void> {
    // Skip for non-200 responses
    if (ctx.status !== 200) {
      return;
    }

    if (
      !ctx.route ||
      !ctx.localeContext ||
      !ctx.experience ||
      !ctx.merchandising
    ) {
      throw new Error(
        "PageAssemblyStage requires route, localeContext, experience, and merchandising to be set",
      );
    }

    // Cart route validation
    if (
      ctx.route.routeKind === "cart" &&
      ctx.experience.cartUxMode !== "page"
    ) {
      this.metrics.recordError("route:cart:blocked_by_mode");
      this.logger.debug(
        JSON.stringify({
          type: "cart_route_blocked_by_mode",
          requestId: ctx.requestId,
          requestedPath: ctx.route.requestedPath,
          resolvedPath: ctx.route.resolvedPath,
          cartUxMode: ctx.experience.cartUxMode,
          locale: ctx.localeContext.locale,
          domain: ctx.localeContext.domain,
        }),
      );

      this.create404Assembly(ctx);
      return;
    }

    // Lookup assembler
    const assembler = this.assemblerRegistry.getAssembler(ctx.route.routeKind);
    if (!assembler) {
      this.create404Assembly(ctx);
      return;
    }

    // Execute assembler with timeout
    const budgetMs = this.budget.getBudgetMs(ctx.route.routeKind);
    let assembly;

    try {
      assembly = await this.resilience.execute(
        `assembler:${ctx.route.routeKind}`,
        () =>
          assembler.assemble({
            route: ctx.route!,
            query: ctx.query,
            localeContext: ctx.localeContext!,
            merchandising: ctx.merchandising!,
            experience: ctx.experience!,
            cookieHeader: ctx.cookieHeader,
          }),
        {
          timeoutMs: budgetMs,
          retries: 0,
          maxConcurrent: 128,
        },
      );
    } catch (error) {
      this.metrics.recordError(`assembler:${ctx.route.routeKind}`);

      if (error instanceof TimeoutPolicyError) {
        this.logger.warn(
          `Assembler timed out routeKind=${ctx.route.routeKind} budgetMs=${budgetMs}`,
        );
      } else {
        this.logger.error(
          `Assembler failed routeKind=${ctx.route.routeKind}`,
          error instanceof Error ? error.stack : String(error),
        );
      }

      this.create404Assembly(ctx);
      return;
    }

    // Handle null assembly
    if (!assembly) {
      this.create404Assembly(ctx);
      return;
    }

    // Populate context with assembly result
    ctx.status = 200;
    ctx.seo = assembly.seo;
    ctx.content = assembly.content;
    ctx.revalidateTags = withLanguageScopedTags(
      assembly.revalidateTags,
      ctx.localeContext.language,
    );
    ctx.assemblerKey = assembly.assemblerKey;
    ctx.assemblyVersion = ASSEMBLY_VERSION;
    ctx.translationVersion = this.i18n.getTranslationVersion();
    ctx.matchedRuleId = ctx.route.matchedRuleId;
  }

  /**
   * Create a 404 assembly and mark context for early return.
   */
  private create404Assembly(ctx: BootstrapContext): void {
    if (!ctx.localeContext || !ctx.route) {
      return;
    }

    ctx.status = 404;
    ctx.seo = {
      title: this.i18n.t(ctx.localeContext.locale, "page.notFoundTitle"),
      description: this.i18n.t(
        ctx.localeContext.locale,
        "page.notFoundDescription",
      ),
    };
    ctx.content = [];
    ctx.revalidateTags = [];
    ctx.assemblyVersion = ASSEMBLY_VERSION;
    ctx.translationVersion = this.i18n.getTranslationVersion();
    ctx.matchedRuleId = ctx.route.matchedRuleId;

    ctx.earlyReturn(404);
  }
}
