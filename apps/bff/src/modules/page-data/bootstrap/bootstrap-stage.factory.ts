import { Injectable } from "@nestjs/common";
import { AssemblyCacheStage } from "../stages/assembly-cache.stage";
import { ContextResolutionStage } from "../stages/context-resolution.stage";
import { LinkLocalizationStage } from "../stages/link-localization.stage";
import { PageAssemblyStage } from "../stages/page-assembly.stage";
import { PersonalizationStage } from "../stages/personalization.stage";
import { RouteRecognitionStage } from "../stages/route-recognition.stage";
import { SlotPlanningStage } from "../stages/slot-planning.stage";
import type { BootstrapStage } from "./bootstrap-stage.interface";

/**
 * Factory service that creates the ordered pipeline of bootstrap stages.
 * Each stage is injected via DI and responsible for a specific phase of bootstrap.
 *
 * Stage execution order (CRITICAL - do not reorder without understanding dependencies):
 *
 * 1. route-recognition: Resolve route and locale context
 *    - Must run first to determine route kind and locale
 *    - Detects 404/301 but does not stop (shell data still needed)
 *
 * 2. context-resolution: Resolve experience and merchandising profiles
 *    - Must run after route (needs route kind and locale)
 *    - Always runs even for 404/301 to populate shell
 *    - Applies default sort to query if needed
 *
 * 3. assembly-cache: Check if cached assembly exists (future)
 *    - Must run before page-assembly to avoid redundant work
 *    - Currently a stub (always misses)
 *
 * 4. page-assembly: Execute assembler to build content
 *    - Skipped if status !== 200
 *    - Requires experience/merchandising context for assembler input
 *    - Sets content, seo, revalidateTags
 *
 * 5. slot-planning: Plan slots from content
 *    - Skipped if status !== 200
 *    - Must run after assembly (needs content nodes)
 *    - Converts content to slot manifests
 *
 * 6. personalization: Apply experience and merchandising overlays to slots
 *    - Skipped if status !== 200
 *    - Must run after slot-planning (needs slot manifests)
 *    - Experience overlay first, merchandising overlay second (last wins)
 *
 * 7. link-localization: Normalize paths and audit compliance
 *    - Always runs (even for 404/301) to ensure shell paths are localized
 *    - Must run last to normalize all paths in final content/slots
 */
@Injectable()
export class BootstrapStageFactory {
  constructor(
    private readonly routeRecognition: RouteRecognitionStage,
    private readonly contextResolution: ContextResolutionStage,
    private readonly assemblyCache: AssemblyCacheStage,
    private readonly pageAssembly: PageAssemblyStage,
    private readonly slotPlanning: SlotPlanningStage,
    private readonly personalization: PersonalizationStage,
    private readonly linkLocalization: LinkLocalizationStage,
  ) {}

  /**
   * Creates the ordered pipeline of bootstrap stages.
   * Each stage implements BootstrapStage interface.
   *
   * Stage order is critical - see class JSDoc for dependencies.
   * Do not reorder without understanding stage contracts.
   *
   * @returns Array of stages in execution order
   */
  createPipeline(): BootstrapStage[] {
    return [
      this.routeRecognition,
      this.contextResolution,
      this.assemblyCache,
      this.pageAssembly,
      this.slotPlanning,
      this.personalization,
      this.linkLocalization,
    ];
  }
}
