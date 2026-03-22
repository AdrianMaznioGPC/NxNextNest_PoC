import type {
  MarketingDirective,
  MarketingDirectiveRequest,
} from "../modules/experience/marketing-directive.types";

export interface MarketingDirectiveProvider {
  getDirectives(
    input: MarketingDirectiveRequest,
  ): Promise<MarketingDirective[]>;
}

export const MARKETING_DIRECTIVE_PORT = Symbol("MARKETING_DIRECTIVE_PORT");
