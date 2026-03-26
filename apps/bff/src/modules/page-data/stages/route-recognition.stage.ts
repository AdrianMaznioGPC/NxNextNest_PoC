import { Injectable } from "@nestjs/common";
import { I18nService } from "../../i18n/i18n.service";
import type { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { BootstrapStage } from "../bootstrap/bootstrap-stage.interface";
import { RouteRecognitionService } from "../routing/route-recognition.service";

/**
 * Stage 1: Route Recognition
 *
 * Responsibilities:
 * - Resolve locale context from requested path
 * - Recognize route kind and extract route parameters
 * - Set initial status (200, 301, 404)
 * - Trigger early return for 404 or unknown routes
 */
@Injectable()
export class RouteRecognitionStage implements BootstrapStage {
  readonly name = "route-recognition";

  constructor(
    private readonly routeRecognition: RouteRecognitionService,
    private readonly i18n: I18nService,
  ) {}

  execute(ctx: BootstrapContext): void {
    // Resolve locale context from requested path (if not already set)
    if (!ctx.localeContext) {
      ctx.localeContext = this.i18n.resolveLocaleContext({});
    }

    // Recognize the route
    const route = this.routeRecognition.recognize(
      ctx.requestedPath,
      ctx.localeContext,
    );

    ctx.route = route;
    ctx.localeContext = route.localeContext;

    // Set status for 404/unknown routes
    if (route.status === 404 || route.routeKind === "unknown") {
      ctx.status = 404;
      ctx.seo = {
        title: this.i18n.t(ctx.localeContext.locale, "page.notFoundTitle"),
        description: this.i18n.t(
          ctx.localeContext.locale,
          "page.notFoundDescription",
        ),
      };
      ctx.matchedRuleId = route.matchedRuleId;
      // Don't early return - context resolution still needs to run for shell data
      return;
    }

    // Set status for 301 redirects
    if (route.status === 301 && route.redirectTo) {
      ctx.status = 301;
      ctx.redirectTo = route.redirectTo;
      ctx.seo = {
        title: this.i18n.t(ctx.localeContext.locale, "page.homeTitle"),
        description: this.i18n.t(
          ctx.localeContext.locale,
          "page.homeDescription",
        ),
      };
      ctx.matchedRuleId = route.matchedRuleId;
      // Don't early return - context resolution still needs to run for shell data
      return;
    }

    // Route is valid - continue to next stages
    ctx.status = 200;
  }
}
