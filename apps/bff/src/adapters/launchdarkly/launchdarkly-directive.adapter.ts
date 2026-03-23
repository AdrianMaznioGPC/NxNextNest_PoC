import { Injectable } from "@nestjs/common";
import { matchesDirective } from "../../modules/experience/directive-matcher";
import type {
  MarketingDirective,
  MarketingDirectiveRequest,
} from "../../modules/experience/marketing-directive.types";
import type { MarketingDirectiveProvider } from "../../ports/marketing-directive.port";
import { LaunchDarklyClientService } from "./launchdarkly-client.service";
import type { LaunchDarklyContext } from "./launchdarkly.types";

/**
 * Implements `MarketingDirectiveProvider` using LaunchDarkly flag evaluations.
 *
 * Evaluates a single JSON flag that returns the full `MarketingDirective[]` payload.
 * LaunchDarkly targeting rules handle the matching logic (store, route, audience, etc.)
 * so the adapter only needs to build the evaluation context and filter results.
 */
@Injectable()
export class LaunchDarklyDirectiveAdapter
  implements MarketingDirectiveProvider
{
  constructor(private readonly ld: LaunchDarklyClientService) {}

  async getDirectives(
    input: MarketingDirectiveRequest,
  ): Promise<MarketingDirective[]> {
    const context = this.buildContext(input);

    const directives = await this.ld.jsonVariation<MarketingDirective[]>(
      this.ld.directivesFlagKey,
      context,
      [],
    );

    return directives
      .filter((directive) => matchesDirective(directive, input))
      .sort((a, b) => b.priority - a.priority);
  }

  private buildContext(input: MarketingDirectiveRequest): LaunchDarklyContext {
    return {
      kind: "multi",
      user: {
        key: input.cookieHeader ?? "anonymous",
        custom: {
          customerProfile: input.customerProfile,
        },
      },
      store: {
        key: input.storeKey,
      },
      campaign: {
        key: input.campaignKey,
      },
      route: {
        key: input.routeKind ?? "unknown",
      },
    };
  }
}
