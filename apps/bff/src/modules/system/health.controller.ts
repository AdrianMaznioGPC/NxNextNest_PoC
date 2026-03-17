import {
  Controller,
  Get,
  ServiceUnavailableException,
  SetMetadata,
} from "@nestjs/common";
import { LOAD_SHED_SCOPE_KEY } from "./load-shedding.config";
import { LoadSheddingGuard } from "./load-shedding.guard";
import { MetricsService } from "./metrics.service";
import { ResilienceService } from "./resilience.service";

/**
 * Kubernetes-style health endpoints.
 *
 * - `/health/live`    — liveness probe: is the process running?
 * - `/health/ready`   — readiness probe: are critical backends reachable?
 * - `/health/metrics` — full diagnostics snapshot
 */
@Controller("health")
export class HealthController {
  constructor(
    private readonly resilience: ResilienceService,
    private readonly metricsService: MetricsService,
    private readonly loadShedding: LoadSheddingGuard,
  ) {}

  @Get("live")
  live() {
    return { status: "ok" };
  }

  @Get("ready")
  ready() {
    const summary = this.resilience.getHealthSummary();

    // If critical backend circuits are open, signal not-ready
    // so load balancers stop sending traffic to this instance.
    const criticalKeys = ["product", "pricing", "collection"];
    const openCircuits = criticalKeys.filter((key) => {
      // Check any circuit key that starts with this scope
      return Object.entries(summary.circuits).some(
        ([k, v]) => k.startsWith(`${key}.`) && v.isOpen,
      );
    });

    if (openCircuits.length > 0) {
      throw new ServiceUnavailableException({
        status: "degraded",
        openCircuits,
        circuits: summary.circuits,
      });
    }

    return { status: "ok", circuits: summary.circuits };
  }

  @Get("metrics")
  @SetMetadata(LOAD_SHED_SCOPE_KEY, undefined) // exempt from load shedding
  getMetrics() {
    return {
      resilience: this.resilience.getHealthSummary(),
      loadShedding: this.loadShedding.getHealthSummary(),
      metrics: this.metricsService.getSnapshot(),
    };
  }
}
