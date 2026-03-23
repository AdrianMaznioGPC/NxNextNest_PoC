import { Module } from "@nestjs/common";
import { CachePolicyService } from "./cache-policy.service";
import { LoadSheddingService } from "./load-shedding.service";
import { ResilienceService } from "./resilience.service";
import { ScalabilityMetricsService } from "./scalability-metrics.service";

@Module({
  providers: [
    CachePolicyService,
    LoadSheddingService,
    ResilienceService,
    ScalabilityMetricsService,
  ],
  exports: [
    CachePolicyService,
    LoadSheddingService,
    ResilienceService,
    ScalabilityMetricsService,
  ],
})
export class SystemModule {}
