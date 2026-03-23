import { Injectable } from "@nestjs/common";
import { matchesDirective } from "../../modules/experience/directive-matcher";
import type {
  MarketingDirective,
  MarketingDirectiveRequest,
} from "../../modules/experience/marketing-directive.types";
import type { MarketingDirectiveProvider } from "../../ports/marketing-directive.port";
import { MOCK_MARKETING_DIRECTIVES } from "./mock-marketing-directives";

@Injectable()
export class MockMarketingDirectiveAdapter
  implements MarketingDirectiveProvider
{
  async getDirectives(
    input: MarketingDirectiveRequest,
  ): Promise<MarketingDirective[]> {
    return MOCK_MARKETING_DIRECTIVES.filter((directive) =>
      matchesDirective(directive, input),
    ).sort((a, b) => b.priority - a.priority);
  }
}
