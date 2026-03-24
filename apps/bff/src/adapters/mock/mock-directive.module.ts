import { Global, Module } from "@nestjs/common";
import { MARKETING_DIRECTIVE_PORT } from "../../ports/marketing-directive.port";
import { MockMarketingDirectiveAdapter } from "./mock-marketing-directive.adapter";

@Global()
@Module({
  providers: [
    {
      provide: MARKETING_DIRECTIVE_PORT,
      useClass: MockMarketingDirectiveAdapter,
    },
  ],
  exports: [MARKETING_DIRECTIVE_PORT],
})
export class MockDirectiveModule {}
