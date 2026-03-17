import { Injectable } from "@nestjs/common";

/**
 * Per-scope chaos configuration.
 * Controls how the chaos adapter modifies behavior for a specific port scope.
 */
export interface ScopeChaosConfig {
  /** Artificial delay added to every call (ms). */
  latencyMs: number;
  /** Probability (0–1) of throwing an error before executing the real call. */
  errorRate: number;
  /** If true, the call returns a never-resolving promise (for timeout testing). */
  hangForever: boolean;
}

/**
 * Top-level chaos configuration.
 * Defaults apply to all scopes unless overridden.
 */
export interface ChaosConfig {
  /** Baseline latency for all scopes without an override (ms). */
  defaultLatencyMs: number;
  /** Baseline error rate for all scopes without an override (0–1). */
  defaultErrorRate: number;
  /** Per-scope overrides. Keys match resilience scope names (e.g., "pricing", "product"). */
  overrides: Record<string, Partial<ScopeChaosConfig>>;
}

const DEFAULT_SCOPE: ScopeChaosConfig = {
  latencyMs: 5,
  errorRate: 0,
  hangForever: false,
};

/**
 * Mutable singleton holding the current chaos injection configuration.
 * Modified at runtime via the ChaosController HTTP endpoints.
 */
@Injectable()
export class ChaosConfigService {
  private config: ChaosConfig = {
    defaultLatencyMs: DEFAULT_SCOPE.latencyMs,
    defaultErrorRate: DEFAULT_SCOPE.errorRate,
    overrides: {},
  };

  getConfig(): ChaosConfig {
    return { ...this.config };
  }

  updateConfig(patch: Partial<ChaosConfig>): ChaosConfig {
    this.config = { ...this.config, ...patch };
    return this.getConfig();
  }

  resetConfig(): ChaosConfig {
    this.config = {
      defaultLatencyMs: DEFAULT_SCOPE.latencyMs,
      defaultErrorRate: DEFAULT_SCOPE.errorRate,
      overrides: {},
    };
    return this.getConfig();
  }

  getScopeConfig(scope: string): ScopeChaosConfig {
    const override = this.config.overrides[scope];
    return {
      latencyMs: override?.latencyMs ?? this.config.defaultLatencyMs,
      errorRate: override?.errorRate ?? this.config.defaultErrorRate,
      hangForever: override?.hangForever ?? false,
    };
  }
}
