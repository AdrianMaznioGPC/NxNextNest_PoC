import { Module } from "@nestjs/common";
import { MARKETING_DIRECTIVE_PORT } from "../../ports/marketing-directive.port";
import {
  LAUNCHDARKLY_CONFIG,
  LaunchDarklyClientService,
} from "./launchdarkly-client.service";
import { LaunchDarklyDirectiveAdapter } from "./launchdarkly-directive.adapter";
import type { LaunchDarklyConfig } from "./launchdarkly.types";

@Module({
  providers: [
    {
      provide: LAUNCHDARKLY_CONFIG,
      useFactory: (): LaunchDarklyConfig => ({
        sdkKey: process.env.LAUNCHDARKLY_SDK_KEY ?? "",
        directivesFlagKey:
          process.env.LAUNCHDARKLY_DIRECTIVES_FLAG_KEY ?? "campaign-directives",
      }),
    },
    LaunchDarklyClientService,
    {
      provide: MARKETING_DIRECTIVE_PORT,
      useClass: LaunchDarklyDirectiveAdapter,
    },
  ],
  exports: [MARKETING_DIRECTIVE_PORT],
})
export class LaunchDarklyModule {}
