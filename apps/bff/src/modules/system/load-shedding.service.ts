import { Injectable, ServiceUnavailableException } from "@nestjs/common";

type ScopeConfig = {
  maxInflight: number;
  retryAfterSeconds: number;
};

@Injectable()
export class LoadSheddingService {
  private readonly inflightByScope = new Map<string, number>();

  async run<T>(
    scope: string,
    config: ScopeConfig,
    task: () => Promise<T>,
  ): Promise<T> {
    const inflight = this.inflightByScope.get(scope) ?? 0;
    if (inflight >= config.maxInflight) {
      throw new ServiceUnavailableException({
        message: "Overloaded",
        scope,
        retryAfterSeconds: config.retryAfterSeconds,
      });
    }

    this.inflightByScope.set(scope, inflight + 1);
    try {
      return await task();
    } finally {
      const current = this.inflightByScope.get(scope) ?? 0;
      if (current <= 1) {
        this.inflightByScope.delete(scope);
      } else {
        this.inflightByScope.set(scope, current - 1);
      }
    }
  }

  getHealthSummary() {
    return {
      inflightByScope: Object.fromEntries(this.inflightByScope),
    };
  }
}
