import { Injectable } from "@nestjs/common";
import type { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { BootstrapStage } from "../bootstrap/bootstrap-stage.interface";

/**
 * Stage 3: Assembly Cache
 *
 * Responsibilities:
 * - Check if assembled page exists in cache
 * - If found, populate context with cached assembly and trigger early return
 * - If not found, continue to page-assembly stage
 * - After assembly stage runs, cache the result
 *
 * NOTE: This is a stub implementation. Cache is not yet enabled.
 * TODO: Integrate with Redis or CDN edge cache
 * TODO: Add cache key fingerprinting (route + query + experience + merchandising)
 * TODO: Add TTL configuration per route kind
 * TODO: Add cache invalidation on revalidation tags
 */
@Injectable()
export class AssemblyCacheStage implements BootstrapStage {
  readonly name = "assembly-cache";

  execute(ctx: BootstrapContext): void {
    // Skip for non-200 responses
    if (ctx.status !== 200) {
      return;
    }

    // Cache is disabled for now
    if (!this.isEnabled()) {
      return;
    }

    const cacheKey = this.buildCacheKey(ctx);

    // TODO: Check cache
    const cachedAssembly = this.get(cacheKey);

    if (cachedAssembly) {
      // Populate context from cache
      ctx.status = cachedAssembly.status;
      ctx.seo = cachedAssembly.seo;
      ctx.content = cachedAssembly.content;
      ctx.revalidateTags = cachedAssembly.revalidateTags;
      ctx.assemblerKey = cachedAssembly.assemblerKey;
      ctx.assemblyVersion = cachedAssembly.assemblyVersion;
      ctx.translationVersion = cachedAssembly.translationVersion;

      // Trigger early return to skip page-assembly stage
      ctx.earlyReturn(cachedAssembly.status);
      return;
    }

    // Cache miss - continue to page-assembly stage
  }

  /**
   * Build a unique cache key from route, query, experience, and merchandising context.
   * TODO: Implement proper fingerprinting
   */
  private buildCacheKey(ctx: BootstrapContext): string {
    if (!ctx.route || !ctx.experience || !ctx.merchandising) {
      return "";
    }

    // Simplified fingerprint - needs refinement
    const parts = [
      ctx.route.routeKind,
      ctx.route.resolvedPath,
      JSON.stringify(ctx.query),
      ctx.experience.storeKey,
      ctx.experience.experienceProfileId,
      ctx.merchandising.mode,
      ctx.merchandising.profileId,
      ctx.localeContext?.language,
    ];

    return parts.join(":");
  }

  /**
   * Get cached assembly by key.
   * TODO: Implement Redis/CDN lookup
   */
  private get(_cacheKey: string): {
    status: 200 | 301 | 404;
    seo: BootstrapContext["seo"];
    content: BootstrapContext["content"];
    revalidateTags: BootstrapContext["revalidateTags"];
    assemblerKey: BootstrapContext["assemblerKey"];
    assemblyVersion: BootstrapContext["assemblyVersion"];
    translationVersion: BootstrapContext["translationVersion"];
  } | null {
    return null;
  }

  /**
   * Store assembly in cache.
   * TODO: Implement Redis/CDN storage
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private set(
    _cacheKey: string,
    _assembly: unknown,
    _ttlSeconds: number,
  ): void {
    // Not yet implemented
  }

  /**
   * Check if cache is enabled.
   * TODO: Add environment variable or feature flag
   */
  private isEnabled(): boolean {
    return false;
  }
}
