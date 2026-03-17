import { Controller, Get } from "@nestjs/common";
import { RouteMatcherFactory } from "./modules/page-data/routing/route-matcher.factory";
import { SlugIndexService } from "./modules/page-data/routing/slug-index.service";
import { LoadSheddingService } from "./modules/system/load-shedding.service";
import { ResilienceService } from "./modules/system/resilience.service";
import { ScalabilityMetricsService } from "./modules/system/scalability-metrics.service";

@Controller()
export class AppController {
  constructor(
    private readonly routeMatcherFactory: RouteMatcherFactory,
    private readonly slugIndex: SlugIndexService,
    private readonly loadShedding: LoadSheddingService,
    private readonly resilience: ResilienceService,
    private readonly metrics: ScalabilityMetricsService,
  ) {}

  @Get("health")
  health() {
    return this.live();
  }

  @Get("health/live")
  live() {
    return {
      status: "ok",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  @Get("health/ready")
  ready() {
    return {
      status: "ready",
      timestamp: new Date().toISOString(),
      routeMatchers: this.routeMatcherFactory.getHealthSummary(),
      slugIndexes: this.slugIndex.getHealthSummary(),
      loadShedding: this.loadShedding.getHealthSummary(),
      resilience: this.resilience.getHealthSummary(),
      metrics: this.metrics.getSnapshot(),
    };
  }
}
