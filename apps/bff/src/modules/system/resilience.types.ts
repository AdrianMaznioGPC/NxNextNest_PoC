/**
 * Per-call resilience policy.
 * Configured per port scope at the injection boundary.
 */
export interface ResiliencePolicy {
  /** Hard timeout for a single attempt (ms). */
  timeoutMs: number;
  /** Number of retries after the first failure. Default: 1 */
  retries?: number;
  /** Base backoff between retries (ms). Exponential with jitter. Default: 25 */
  retryBackoffMs?: number;
  /** Max concurrent in-flight calls for this scope. Default: 64 */
  maxConcurrent?: number;
  /** Consecutive failures before opening the circuit. Default: 5 */
  circuitFailureThreshold?: number;
  /** How long the circuit stays open before a half-open probe (ms). Default: 30000 */
  circuitResetMs?: number;
}

export interface NormalizedPolicy extends Required<ResiliencePolicy> {}

export interface CircuitState {
  consecutiveFailures: number;
  openedUntilMs?: number;
}

export interface CircuitSnapshot {
  consecutiveFailures: number;
  openedUntilMs?: number;
  isOpen: boolean;
}

export interface ResilienceHealthSummary {
  activeConcurrency: Record<string, number>;
  circuits: Record<string, CircuitSnapshot>;
}

// -- Resilience error classes ------------------------------------------------

export class TimeoutPolicyError extends Error {
  constructor(key: string) {
    super(`Timeout exceeded for "${key}"`);
    this.name = "TimeoutPolicyError";
  }
}

export class CircuitOpenError extends Error {
  constructor(key: string) {
    super(`Circuit open for "${key}"`);
    this.name = "CircuitOpenError";
  }
}

export class ConcurrencyLimitError extends Error {
  constructor(key: string) {
    super(`Concurrency limit exceeded for "${key}"`);
    this.name = "ConcurrencyLimitError";
  }
}
