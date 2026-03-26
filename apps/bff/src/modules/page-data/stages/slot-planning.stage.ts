import type { SlotManifest } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { BootstrapStage } from "../bootstrap/bootstrap-stage.interface";
import { SlotPlannerService } from "../slot-planner.service";

/**
 * Stage 5: Slot Planning
 *
 * Responsibilities:
 * - Transform content nodes into planned slots with renderer keys
 * - Assign slot priorities (critical vs deferred)
 * - Skip slot planning for 404 responses (return empty slots)
 * - Store planned slots in context for next stage
 */
@Injectable()
export class SlotPlanningStage implements BootstrapStage {
  readonly name = "slot-planning";

  // Store planned slots in context (temporary field)
  // This will be removed when we formalize the model
  private plannedSlotsMap = new WeakMap<BootstrapContext, SlotManifest[]>();

  constructor(private readonly slotPlanner: SlotPlannerService) {}

  execute(ctx: BootstrapContext): void {
    if (!ctx.route || !ctx.localeContext) {
      throw new Error(
        "SlotPlanningStage requires route and localeContext to be set",
      );
    }

    // Skip slot planning for 404 responses
    if (ctx.status === 404) {
      this.plannedSlotsMap.set(ctx, []);
      return;
    }

    // Build ResolvedPageModel-like object for slot planner
    const resolvedModel = {
      schemaVersion: 2 as const,
      path: ctx.route.resolvedPath,
      status: ctx.status ?? 200,
      routeKind:
        ctx.route.routeKind === "unknown" ? undefined : ctx.route.routeKind,
      requestedPath: ctx.route.requestedPath,
      resolvedPath: ctx.route.resolvedPath,
      canonicalPath: ctx.route.canonicalPath,
      localeContext: ctx.localeContext,
      seo: ctx.seo ?? { title: "", description: "" },
      content: ctx.content ?? [],
      revalidateTags: ctx.revalidateTags ?? [],
      canonicalUrl: `https://${ctx.localeContext.domain}${ctx.route.resolvedPath}`,
      alternates: {},
      translationVersion: ctx.translationVersion ?? "",
      matchedRuleId: ctx.matchedRuleId ?? ctx.route.matchedRuleId,
      assemblerKey: ctx.assemblerKey,
      assemblyVersion: ctx.assemblyVersion ?? "v1",
    };

    // Plan slots
    const plannedSlots = this.slotPlanner.plan({
      resolved: resolvedModel,
      path: ctx.route.resolvedPath,
      query: ctx.query,
      localeContext: ctx.localeContext,
      route: ctx.route,
    });

    // Store in context for personalization stage
    this.plannedSlotsMap.set(ctx, plannedSlots);
  }

  /**
   * Get planned slots from context (used by personalization stage).
   */
  getPlannedSlots(ctx: BootstrapContext): SlotManifest[] {
    return this.plannedSlotsMap.get(ctx) ?? [];
  }
}
