import { Injectable } from "@nestjs/common";

export type ExecutePolicy = {
  timeoutMs: number;
  retries?: number;
  retryBackoffMs?: number;
  maxConcurrent?: number;
  circuitFailureThreshold?: number;
  circuitResetMs?: number;
};

export class TimeoutPolicyError extends Error {}
export class CircuitOpenError extends Error {}
export class ConcurrencyLimitError extends Error {}

type CircuitState = {
  consecutiveFailures: number;
  openedUntilMs?: number;
};

@Injectable()
export class ResilienceService {
  private readonly activeCounts = new Map<string, number>();
  private readonly circuitStates = new Map<string, CircuitState>();

  async execute<T>(
    key: string,
    task: () => Promise<T>,
    policy: ExecutePolicy,
  ): Promise<T> {
    const normalized = withDefaults(policy);
    this.guardCircuit(key, normalized);
    this.guardConcurrency(key, normalized);

    try {
      let attempt = 0;
      while (true) {
        try {
          const result = await withTimeout(task(), normalized.timeoutMs);
          this.markSuccess(key);
          return result;
        } catch (error) {
          attempt += 1;
          this.markFailure(key, normalized);
          if (attempt > normalized.retries) {
            throw error;
          }
          await sleep(backoffForAttempt(normalized.retryBackoffMs, attempt));
        }
      }
    } finally {
      this.releaseConcurrency(key);
    }
  }

  getHealthSummary() {
    return {
      activeConcurrency: Object.fromEntries(this.activeCounts),
      circuits: Object.fromEntries(
        [...this.circuitStates.entries()].map(([key, value]) => [
          key,
          {
            consecutiveFailures: value.consecutiveFailures,
            openedUntilMs: value.openedUntilMs,
            isOpen:
              value.openedUntilMs !== undefined &&
              value.openedUntilMs > Date.now(),
          },
        ]),
      ),
    };
  }

  private guardCircuit(key: string, policy: Required<ExecutePolicy>) {
    const state = this.circuitStates.get(key);
    if (!state?.openedUntilMs) {
      return;
    }
    if (Date.now() < state.openedUntilMs) {
      throw new CircuitOpenError(`Circuit open for key "${key}"`);
    }
  }

  private guardConcurrency(key: string, policy: Required<ExecutePolicy>) {
    const current = this.activeCounts.get(key) ?? 0;
    if (current >= policy.maxConcurrent) {
      throw new ConcurrencyLimitError(
        `Concurrency limit exceeded for "${key}"`,
      );
    }
    this.activeCounts.set(key, current + 1);
  }

  private releaseConcurrency(key: string) {
    const current = this.activeCounts.get(key) ?? 0;
    if (current <= 1) {
      this.activeCounts.delete(key);
      return;
    }
    this.activeCounts.set(key, current - 1);
  }

  private markSuccess(key: string) {
    this.circuitStates.set(key, { consecutiveFailures: 0 });
  }

  private markFailure(key: string, policy: Required<ExecutePolicy>) {
    const current = this.circuitStates.get(key) ?? { consecutiveFailures: 0 };
    const nextFailures = current.consecutiveFailures + 1;
    if (nextFailures >= policy.circuitFailureThreshold) {
      this.circuitStates.set(key, {
        consecutiveFailures: nextFailures,
        openedUntilMs: Date.now() + policy.circuitResetMs,
      });
      return;
    }

    this.circuitStates.set(key, {
      consecutiveFailures: nextFailures,
    });
  }
}

function withDefaults(policy: ExecutePolicy): Required<ExecutePolicy> {
  return {
    timeoutMs: policy.timeoutMs,
    retries: policy.retries ?? 1,
    retryBackoffMs: policy.retryBackoffMs ?? 25,
    maxConcurrent: policy.maxConcurrent ?? 64,
    circuitFailureThreshold: policy.circuitFailureThreshold ?? 5,
    circuitResetMs: policy.circuitResetMs ?? 30_000,
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutPolicyError()), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  }) as Promise<T>;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffForAttempt(baseMs: number, attempt: number) {
  const jitter = Math.floor(Math.random() * 10);
  return baseMs * attempt + jitter;
}
