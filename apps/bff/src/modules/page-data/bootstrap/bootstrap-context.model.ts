import type {
  LinkLocalizationAudit,
  LocaleContext,
  PageContentNode,
  PageSeo,
  SlotManifest,
} from "@commerce/shared-types";
import type { ResolvedExperienceProfile } from "../../experience/experience-profile.types";
import type { ResolvedMerchandisingProfile } from "../../merchandising/merchandising-profile.types";
import type { ResolvedRouteDescriptor } from "../routing/route-rule.types";

/**
 * Mutable context object passed through all bootstrap stages.
 * Holds all data needed to build the final PageBootstrapModel response.
 *
 * Each stage reads from and writes to this shared context.
 * Fields are populated progressively as the pipeline executes.
 */
export class BootstrapContext {
  /** Original requested path (never modified) */
  public readonly requestedPath: string;

  /** Query parameters (may be modified by merchandising stage to inject default sort) */
  public query: Record<string, string | undefined>;

  /** Locale context resolved from domain, path, and query params (set by route-recognition stage) */
  public localeContext?: LocaleContext;

  /** Unique request identifier for logging/tracing (never modified) */
  public readonly requestId: string;

  /** Optional cookie header for cart/experience resolution (never modified) */
  public readonly cookieHeader?: string;

  /** Resolved route information: kind, params, paths (set by route-recognition stage) */
  public route?: ResolvedRouteDescriptor;

  /** Resolved experience profile: theme, layout, cart UX mode (set by context-resolution stage) */
  public experience?: ResolvedExperienceProfile;

  /** Resolved merchandising profile: mode, default sort (set by context-resolution stage) */
  public merchandising?: ResolvedMerchandisingProfile;

  /** Whether default sort was applied to query (set by context-resolution stage) */
  public defaultSortApplied?: boolean;

  /** Final HTTP status code: 200 (success), 301 (redirect), 404 (not found) */
  public status?: 200 | 301 | 404;

  /** SEO metadata for the page: title, description, image (set by page-assembly stage) */
  public seo?: PageSeo;

  /** Page content nodes before slot planning (set by page-assembly stage) */
  public content?: PageContentNode[];

  /** Revalidation cache tags for CDN invalidation (set by page-assembly stage) */
  public revalidateTags?: string[];

  /** Redirect target URL for 301 responses (set by route-recognition stage) */
  public redirectTo?: string;

  /** Matched route rule identifier for debugging (set by route-recognition stage) */
  public matchedRuleId?: string;

  /** Assembler identifier used to build this page (set by page-assembly stage) */
  public assemblerKey?: string;

  /** Assembly schema version (set by page-assembly stage) */
  public assemblyVersion?: string;

  /** Translation version from assembler or i18n service (set by page-assembly stage) */
  public translationVersion?: string;

  /** Planned slots: inline vs deferred, with payloads (set by slot-planning stage) */
  public slots?: SlotManifest[];

  /** Link localization audit results: violations and warnings (set by link-localization stage) */
  public localizationAudit?: LinkLocalizationAudit;

  /** Flag to stop pipeline early (e.g., after 404 or 301) */
  private stopProcessing = false;

  constructor(params: {
    requestedPath: string;
    query: Record<string, string | undefined>;
    requestId: string;
    cookieHeader?: string;
  }) {
    this.requestedPath = params.requestedPath;
    this.query = params.query;
    this.requestId = params.requestId;
    this.cookieHeader = params.cookieHeader;
  }

  /**
   * Indicates if pipeline should stop processing.
   * Returns true after `earlyReturn()` is called (e.g., assembly failure).
   *
   * Note: Route recognition and context resolution run even for 404/301
   * to populate shell data. Only assembly and downstream stages are skipped.
   *
   * @returns true if subsequent stages should skip execution
   */
  shouldStopProcessing(): boolean {
    return this.stopProcessing;
  }

  /**
   * Mark context for early return with specified status.
   * Sets status, optional redirectTo, and stops further processing.
   *
   * Called by stages when:
   * - Assembly fails (404)
   * - Cart route is blocked by cartUxMode (404)
   *
   * @param status - HTTP status code (200/301/404)
   * @param redirectTo - Optional redirect URL (for 301 responses)
   */
  earlyReturn(status: 200 | 301 | 404, redirectTo?: string): void {
    this.status = status;
    this.redirectTo = redirectTo;
    this.stopProcessing = true;
  }
}
