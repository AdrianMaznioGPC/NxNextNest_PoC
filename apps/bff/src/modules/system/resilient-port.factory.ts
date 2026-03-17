import type { ResilienceService } from "./resilience.service";
import type { ResiliencePolicy } from "./resilience.types";

/**
 * Creates a `Proxy` that wraps every method on a port with resilience policies.
 *
 * The returned object looks identical to the original port — callers
 * (domain services, controllers) have no idea resilience is applied.
 * Every method call is routed through `ResilienceService.execute()` with
 * a scope key of `"{scopeKey}.{methodName}"`.
 *
 * @param port        The real adapter instance (e.g., MockPricingAdapter)
 * @param resilience  The singleton ResilienceService
 * @param scopeKey    A short identifier used in circuit/metric keys (e.g., "pricing")
 * @param policy      The resilience policy applied to every method call
 * @param fallbacks   Optional per-method fallback values. When provided, the proxy
 *                    uses `executeOrDefault` so resilience failures degrade gracefully
 *                    instead of throwing. The value can be a static default or a
 *                    factory function `() => T` for fresh instances (e.g., `() => new Map()`).
 */
export function createResilientPort<T extends object>(
  port: T,
  resilience: ResilienceService,
  scopeKey: string,
  policy: ResiliencePolicy,
  fallbacks?: Partial<
    Record<string & keyof T, unknown | (() => unknown)>
  >,
): T {
  return new Proxy(port, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);

      if (typeof original !== "function") {
        return original;
      }

      const methodKey = `${scopeKey}.${String(prop)}`;
      const fallback = fallbacks?.[prop as string & keyof T];

      return (...args: unknown[]) => {
        const task = () => original.apply(target, args);

        if (fallback !== undefined) {
          const fallbackValue =
            typeof fallback === "function" ? (fallback as () => unknown)() : fallback;
          return resilience.executeOrDefault(
            methodKey,
            task,
            policy,
            fallbackValue,
          );
        }

        return resilience.execute(methodKey, task, policy);
      };
    },
  });
}
