import { Injectable } from "@nestjs/common";

type LatencySnapshot = {
  count: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
};

@Injectable()
export class ScalabilityMetricsService {
  private readonly routeCounts = new Map<string, number>();
  private readonly bootstrapCounts = new Map<string, number>();
  private readonly slotCounts = new Map<string, number>();
  private readonly merchandisingCounts = new Map<string, number>();
  private readonly latencies = new Map<string, number[]>();
  private readonly errors = new Map<string, number>();

  recordRoute(params: {
    matchedRuleId: string;
    locale: string;
    status: number;
    latencyMs: number;
  }) {
    const key = `route:${params.matchedRuleId}:${params.locale}:${params.status}`;
    this.increment(this.routeCounts, key);
    this.recordLatency(`route:${params.matchedRuleId}`, params.latencyMs);
  }

  recordBootstrap(params: {
    routeKind: string;
    assemblerKey?: string;
    status: number;
    latencyMs: number;
  }) {
    const key = `bootstrap:${params.routeKind}:${params.status}`;
    this.increment(this.bootstrapCounts, key);
    this.recordLatency("bootstrap:total", params.latencyMs);
    this.recordLatency(`bootstrap:${params.routeKind}`, params.latencyMs);
    if (params.assemblerKey) {
      this.recordLatency(`assembler:${params.assemblerKey}`, params.latencyMs);
    }
  }

  recordSlot(params: { slotId: string; status: number; latencyMs: number }) {
    const key = `slot:${params.slotId}:${params.status}`;
    this.increment(this.slotCounts, key);
    this.recordLatency(`slot:${params.slotId}`, params.latencyMs);
  }

  recordMerchandising(params: {
    storeKey: string;
    routeKind: string;
    language: string;
    mode: string;
    profileId: string;
  }) {
    const key = `merchandising:${params.storeKey}:${params.routeKind}:${params.language}:${params.mode}:${params.profileId}`;
    this.increment(this.merchandisingCounts, key);
  }

  recordError(scope: string) {
    this.increment(this.errors, scope);
  }

  getSnapshot() {
    return {
      routeCounts: Object.fromEntries(this.routeCounts),
      bootstrapCounts: Object.fromEntries(this.bootstrapCounts),
      slotCounts: Object.fromEntries(this.slotCounts),
      merchandisingCounts: Object.fromEntries(this.merchandisingCounts),
      latency: Object.fromEntries(
        [...this.latencies.entries()].map(([key, samples]) => [
          key,
          toLatencySnapshot(samples),
        ]),
      ),
      errors: Object.fromEntries(this.errors),
    };
  }

  private recordLatency(key: string, value: number) {
    const current = this.latencies.get(key) ?? [];
    current.push(value);
    // Keep bounded samples per metric key.
    if (current.length > 2000) {
      current.splice(0, current.length - 2000);
    }
    this.latencies.set(key, current);
  }

  private increment(map: Map<string, number>, key: string) {
    map.set(key, (map.get(key) ?? 0) + 1);
  }
}

function toLatencySnapshot(samples: number[]): LatencySnapshot {
  if (samples.length === 0) {
    return { count: 0, p50Ms: 0, p95Ms: 0, p99Ms: 0, maxMs: 0 };
  }

  const sorted = [...samples].sort((a, b) => a - b);
  return {
    count: sorted.length,
    p50Ms: percentile(sorted, 0.5),
    p95Ms: percentile(sorted, 0.95),
    p99Ms: percentile(sorted, 0.99),
    maxMs: sorted[sorted.length - 1] ?? 0,
  };
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * p));
  return sorted[idx] ?? 0;
}
