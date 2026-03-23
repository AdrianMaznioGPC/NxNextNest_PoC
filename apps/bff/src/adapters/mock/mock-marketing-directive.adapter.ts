import { Injectable } from "@nestjs/common";
import type { MarketingDirectiveProvider } from "../../ports/marketing-directive.port";
import type {
  MarketingDirective,
  MarketingDirectiveRequest,
} from "../../modules/experience/marketing-directive.types";
import { MOCK_MARKETING_DIRECTIVES } from "./mock-marketing-directives";

@Injectable()
export class MockMarketingDirectiveAdapter
  implements MarketingDirectiveProvider
{
  async getDirectives(
    input: MarketingDirectiveRequest,
  ): Promise<MarketingDirective[]> {
    return MOCK_MARKETING_DIRECTIVES
      .filter((directive) => matchesDirective(directive, input))
      .sort((a, b) => b.priority - a.priority);
  }
}

function matchesDirective(
  directive: MarketingDirective,
  input: MarketingDirectiveRequest,
) {
  return (
    directive.campaignKey === input.campaignKey &&
    (directive.storeKeys.includes("*") ||
      directive.storeKeys.includes(input.storeKey)) &&
    (directive.routeKinds.includes("*") ||
      (input.routeKind
        ? directive.routeKinds.includes(input.routeKind as never)
        : false)) &&
    (!directive.customerProfiles ||
      directive.customerProfiles.includes("*") ||
      directive.customerProfiles.includes(input.customerProfile))
  );
}
