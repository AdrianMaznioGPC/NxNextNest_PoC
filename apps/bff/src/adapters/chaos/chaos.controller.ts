import { Body, Controller, Get, Param, Post, Put, SetMetadata } from "@nestjs/common";
import { CACHE_ROUTE_KIND_KEY } from "../../modules/system/cache-policy.service";
import { LOAD_SHED_SCOPE_KEY } from "../../modules/system/load-shedding.config";
import {
  type ChaosConfig,
  ChaosConfigService,
  type ScopeChaosConfig,
} from "./chaos-config.service";

/**
 * HTTP control plane for live chaos injection.
 *
 * Allows k6 scripts to dynamically change failure modes mid-test
 * without restarting the BFF.
 *
 * Exempt from load shedding and caching so it remains accessible
 * even when the system is overloaded.
 */
@Controller("chaos")
@SetMetadata(LOAD_SHED_SCOPE_KEY, undefined)
@SetMetadata(CACHE_ROUTE_KIND_KEY, undefined)
export class ChaosController {
  constructor(private readonly chaosConfig: ChaosConfigService) {}

  /** Get the current chaos configuration. */
  @Get("config")
  getConfig(): ChaosConfig {
    return this.chaosConfig.getConfig();
  }

  /** Replace the entire chaos configuration. */
  @Put("config")
  updateConfig(@Body() body: Partial<ChaosConfig>): ChaosConfig {
    return this.chaosConfig.updateConfig(body);
  }

  /** Update chaos config for a single scope. */
  @Put("config/:scope")
  updateScope(
    @Param("scope") scope: string,
    @Body() body: Partial<ScopeChaosConfig>,
  ): ChaosConfig {
    const current = this.chaosConfig.getConfig();
    current.overrides[scope] = { ...current.overrides[scope], ...body };
    return this.chaosConfig.updateConfig(current);
  }

  /** Reset chaos config to defaults (no injection). */
  @Post("reset")
  reset(): ChaosConfig {
    return this.chaosConfig.resetConfig();
  }
}
