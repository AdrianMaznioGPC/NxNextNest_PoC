import type { BootstrapContext } from "./bootstrap-context.model";

/**
 * Interface for a single stage in the bootstrap pipeline.
 * Each stage performs a specific transformation or data resolution step.
 *
 * Stages are executed sequentially by BootstrapOrchestratorService.
 * Each stage reads from and writes to the shared BootstrapContext.
 *
 * Example stages:
 * - RouteRecognitionStage: Resolves route kind and locale
 * - PageAssemblyStage: Executes assembler to build content
 * - PersonalizationStage: Applies experience/merchandising overlays
 *
 * @see BootstrapStageFactory for pipeline ordering
 */
export interface BootstrapStage {
  /**
   * Unique name for logging and debugging.
   * Used in metrics and timing logs.
   */
  readonly name: string;

  /**
   * Execute this stage's logic.
   * May mutate the context object to set fields.
   *
   * Stages should:
   * - Check ctx.status to determine if they should run
   * - Use ctx.earlyReturn() to stop processing on critical failures
   * - Log errors with ctx.requestId for tracing
   *
   * @param ctx - The shared bootstrap context
   */
  execute(ctx: BootstrapContext): Promise<void> | void;

  /**
   * Optional: Determine if this stage should run.
   * If not provided, stage always runs (unless ctx.shouldStopProcessing() is true).
   *
   * Use this for:
   * - Skipping stages when status is 404/301
   * - Conditional logic based on route kind or experience flags
   *
   * @param ctx - The shared bootstrap context
   * @returns true if this stage should execute, false to skip
   */
  shouldRun?(ctx: BootstrapContext): boolean;
}
