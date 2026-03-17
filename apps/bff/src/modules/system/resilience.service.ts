import { Injectable, Logger } from "@nestjs/common";
import type {
  CircuitState,
  NormalizedPolicy,
  ResilienceHealthSummary,
  ResiliencePolicy,
} from "./resilience.types";
import {
  CircuitOpenError,
  ConcurrencyLimitError,
  TimeoutPolicyError,
} from "./resilience.types";

@Injectable()
export class ResilienceService {
  private readonly logger = new Logger(ResilienceService.name);

  private readonly activeCounts = new Map<string, number>();
  private readonly circuitStates = new Map<string, CircuitState>();

  /**
   * Execute a task with timeout, retry, circuit breaker, and concurrency control.
   * Throws on failure after exhausting retries / if circuit is open.
   */
  async execute<T>(
    key: string,
    task: () => Promise<T>,
    policy: ResiliencePolicy,
  ): Promise<T> {
    const normalized = withDefaults(policy);

    this.guardCircuit(key);
    this.acquireConcurrency(key, normalized);

    try {
      return await this.attemptWithRetries(key, task, normalized);
    } finally {
      this.releaseConcurrency(key);
    }
  }

  /**
   * Execute a task, returning a fallback value on any failure.
   *
   * When a fallback is explicitly configured for a method, the caller has
   * declared "I'd rather have degraded data than an error." This catches
   * all errors — resilience errors (timeout, circuit open, concurrency)
   * as well as upstream backend errors (connection refused, HTTP 500, etc.).
   */
  async executeOrDefault<T>(
    key: string,
    task: () => Promise<T>,
    policy: ResiliencePolicy,
    fallback: T,
  ): Promise<T> {
    try {
      return await this.execute(key, task, policy);
    } catch (error) {
      this.logger.warn(
        `Degrading gracefully for "${key}": ${(error as Error).message}`,
      );
      return fallback;
    }
  }

  getHealthSummary(): ResilienceHealthSummary {
    return {
      activeConcurrency: Object.fromEntries(this.activeCounts),
      circuits: Object.fromEntries(
        [...this.circuitStates.entries()].map(([key, state]) => [
          key,
          {
            consecutiveFailures: state.consecutiveFailures,
            openedUntilMs: state.openedUntilMs,
            isOpen:
              state.openedUntilMs !== undefined &&
              state.openedUntilMs > Date.now(),
          },
        ]),
      ),
    };
  }

  // ---------------------------------------------------------------------------

  private async attemptWithRetries<T>(
    key: string,
    task: () => Promise<T>,
    policy: NormalizedPolicy,
  ): Promise<T> {
    let attempt = 0;

    while (true) {
      try {
        const result = await withTimeout(task(), policy.timeoutMs, key);
        this.markSuccess(key);
        return result;
      } catch (error) {
        attempt += 1;
        this.markFailure(key, policy);

        if (attempt > policy.retries) {
          throw error;
        }

        const delay = backoffForAttempt(policy.retryBackoffMs, attempt);
        this.logger.debug(
          `Retry ${attempt}/${policy.retries} for "${key}" after ${delay}ms`,
        );
        await sleep(delay);
      }
    }
  }

  private guardCircuit(key: string): void {
    const state = this.circuitStates.get(key);
    if (!state?.openedUntilMs) return;

    if (Date.now() < state.openedUntilMs) {
      throw new CircuitOpenError(key);
    }
    // Circuit is half-open — allow the probe through
  }

  private acquireConcurrency(key: string, policy: NormalizedPolicy): void {
    const current = this.activeCounts.get(key) ?? 0;
    if (current >= policy.maxConcurrent) {
      throw new ConcurrencyLimitError(key);
    }
    this.activeCounts.set(key, current + 1);
  }

  private releaseConcurrency(key: string): void {
    const current = this.activeCounts.get(key) ?? 0;
    if (current <= 1) {
      this.activeCounts.delete(key);
    } else {
      this.activeCounts.set(key, current - 1);
    }
  }

  private markSuccess(key: string): void {
    const state = this.circuitStates.get(key);
    if (state && state.consecutiveFailures > 0) {
      this.logger.log(`Circuit closed for "${key}"`);
    }
    this.circuitStates.set(key, { consecutiveFailures: 0 });
  }

  private markFailure(key: string, policy: NormalizedPolicy): void {
    const current = this.circuitStates.get(key) ?? {
      consecutiveFailures: 0,
    };
    const next = current.consecutiveFailures + 1;

    if (next >= policy.circuitFailureThreshold) {
      const openUntil = Date.now() + policy.circuitResetMs;
      this.circuitStates.set(key, {
        consecutiveFailures: next,
        openedUntilMs: openUntil,
      });
      this.logger.warn(
        `Circuit opened for "${key}" after ${next} consecutive failures (resets at ${new Date(openUntil).toISOString()})`,
      );
      return;
    }

    this.circuitStates.set(key, { consecutiveFailures: next });
  }
}

// -- Pure helpers ------------------------------------------------------------

function withDefaults(policy: ResiliencePolicy): NormalizedPolicy {
  return {
    timeoutMs: policy.timeoutMs,
    retries: policy.retries ?? 1,
    retryBackoffMs: policy.retryBackoffMs ?? 25,
    maxConcurrent: policy.maxConcurrent ?? 64,
    circuitFailureThreshold: policy.circuitFailureThreshold ?? 5,
    circuitResetMs: policy.circuitResetMs ?? 30_000,
  };
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  key: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutPolicyError(key)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() =>
    clearTimeout(timer),
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffForAttempt(baseMs: number, attempt: number): number {
  const jitter = Math.floor(Math.random() * 10);
  return baseMs * attempt + jitter;
}

function isResilienceError(error: unknown): boolean {
  return (
    error instanceof TimeoutPolicyError ||
    error instanceof CircuitOpenError ||
    error instanceof ConcurrencyLimitError
  );
}
