import type { ChaosConfigService } from "./chaos-config.service";

/**
 * Creates a Proxy that wraps every method on a port adapter with chaos injection.
 *
 * Before each method call, the proxy checks the current chaos config for
 * the given scope and may:
 * - Return a never-resolving promise (hangForever → tests timeouts)
 * - Add artificial latency (latencyMs → tests concurrency piling / slow backends)
 * - Throw an error with configurable probability (errorRate → tests circuit breaker / retries)
 *
 * If none of the chaos conditions trigger, the original method is called normally.
 *
 * @param realAdapter  The underlying mock adapter instance
 * @param chaosConfig  The ChaosConfigService singleton
 * @param scope        Scope key matching resilience policy names (e.g., "pricing")
 */
export function createChaosAdapter<T extends object>(
  realAdapter: T,
  chaosConfig: ChaosConfigService,
  scope: string,
): T {
  return new Proxy(realAdapter, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);

      if (typeof original !== "function") {
        return original;
      }

      return (...args: unknown[]) => {
        const cfg = chaosConfig.getScopeConfig(scope);

        // Never-resolving promise — triggers timeout policy
        if (cfg.hangForever) {
          return new Promise(() => {});
        }

        // Wrap in async to support latency + error injection
        return (async () => {
          // Artificial latency
          if (cfg.latencyMs > 0) {
            await new Promise((resolve) =>
              setTimeout(resolve, cfg.latencyMs),
            );
          }

          // Random error injection
          if (cfg.errorRate > 0 && Math.random() < cfg.errorRate) {
            throw new Error(
              `Chaos: injected failure for ${scope}.${String(prop)}`,
            );
          }

          // Call through to the real adapter
          return original.apply(target, args);
        })();
      };
    },
  });
}
