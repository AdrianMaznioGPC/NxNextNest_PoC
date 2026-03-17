import { Injectable } from "@nestjs/common";

interface LatencySnapshot {
  count: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
}

export interface MetricsSnapshot {
  requestCounts: Record<string, number>;
  latency: Record<string, LatencySnapshot>;
  errors: Record<string, number>;
}

const MAX_SAMPLES = 2000;

/**
 * In-process metrics collector.
 *
 * Provides counters, latency percentile histograms, and error counts
 * with bounded memory usage (ring-buffer per key).
 *
 * Exposed via the `/health/metrics` endpoint for diagnostics.
 * Can be replaced by OpenTelemetry SDK later without changing consumers.
 */
@Injectable()
export class MetricsService {
  private readonly requestCounts = new Map<string, number>();
  private readonly latencies = new Map<string, number[]>();
  private readonly errors = new Map<string, number>();

  recordRequest(
    method: string,
    path: string,
    status: number,
    durationMs: number,
  ): void {
    const key = `${method} ${path} ${status}`;
    this.increment(this.requestCounts, key);
    this.recordLatency(`request:${method}:${status}`, durationMs);
  }

  recordPortLatency(scope: string, durationMs: number): void {
    this.recordLatency(`port:${scope}`, durationMs);
  }

  recordError(scope: string): void {
    this.increment(this.errors, scope);
  }

  getSnapshot(): MetricsSnapshot {
    return {
      requestCounts: Object.fromEntries(this.requestCounts),
      latency: Object.fromEntries(
        [...this.latencies.entries()].map(([key, samples]) => [
          key,
          toLatencySnapshot(samples),
        ]),
      ),
      errors: Object.fromEntries(this.errors),
    };
  }

  private recordLatency(key: string, value: number): void {
    let samples = this.latencies.get(key);
    if (!samples) {
      samples = [];
      this.latencies.set(key, samples);
    }
    samples.push(value);
    if (samples.length > MAX_SAMPLES) {
      samples.splice(0, samples.length - MAX_SAMPLES);
    }
  }

  private increment(map: Map<string, number>, key: string): void {
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
  const idx = Math.min(
    sorted.length - 1,
    Math.floor(sorted.length * p),
  );
  return sorted[idx] ?? 0;
}
