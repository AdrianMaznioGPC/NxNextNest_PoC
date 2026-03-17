# Chaos Testing

## Overview

The chaos testing system lets you inject configurable failures into the BFF's backend adapters at runtime. Combined with k6 load tests, it validates that the resilience layer (timeouts, retries, circuit breakers, concurrency limits, fallbacks, load shedding) works correctly under stress.

**Activation:** `BFF_BACKEND=chaos npx nx run bff:dev`

## Architecture

```
k6 (HTTP load) ──→ BFF (:4000) ──→ ResilienceProxy
                       │                    │
                  /chaos/* endpoints    ChaosProxy
                  (live control)            │
                                       MockAdapter
```

**Stack per port call:**
`MockAdapter → ChaosProxy (latency/errors/hangs) → ResilienceProxy (timeout/retry/circuit) → Consumer`

## ChaosBackendModule (`adapters/chaos/`)

Replaces `MockBackendModule`. Provides the same `RAW_*` tokens but wraps each mock adapter with a chaos proxy via `createChaosAdapter()`.

### Internal Wiring

The module uses internal `MOCK_*` symbols for the unwrapped mock adapter instances. This avoids token collisions with the `RAW_*` tokens that `SystemModule` expects. Cross-port dependencies (e.g., `MockCartAdapter` needs `MockProductAdapter`) are wired within the unwrapped layer.

### `createChaosAdapter()` (`create-chaos-adapter.ts`)

Creates a JavaScript `Proxy` that intercepts every method call. Before calling the real adapter, it checks `ChaosConfigService`:

1. **`hangForever: true`** → Returns `new Promise(() => {})` (never resolves). Tests timeout policy.
2. **`latencyMs > 0`** → Adds artificial delay. Tests concurrency piling.
3. **`errorRate > 0`** → Throws with probability `errorRate` (0–1). Tests retries and circuit breaker.

### `ChaosConfigService` (`chaos-config.service.ts`)

Mutable singleton holding the current chaos configuration:

```typescript
interface ChaosConfig {
  defaultLatencyMs: number;          // Baseline latency for all scopes
  defaultErrorRate: number;          // Baseline error rate for all scopes
  overrides: Record<string, Partial<ScopeChaosConfig>>;  // Per-scope overrides
}
```

Default config: `{ defaultLatencyMs: 5, defaultErrorRate: 0, overrides: {} }` (near-transparent).

### ChaosController (`chaos.controller.ts`)

HTTP control plane for live configuration changes:

| Method | Path | Description |
|--------|------|-------------|
| `GET /chaos/config` | Get current config |
| `PUT /chaos/config` | Replace entire config |
| `PUT /chaos/config/:scope` | Update one scope |
| `POST /chaos/reset` | Reset to defaults |

Exempt from load shedding and caching so it remains accessible during overload.

## k6 Test Scenarios

See [load-testing.md](./load-testing.md) for full details on running tests and interpreting results.

| # | Scenario | What It Proves |
|---|----------|---------------|
| 01 | Baseline | Happy-path latency and throughput |
| 02 | Timeout | Hanging backends → 504, then circuit trips → 503 fast-fail |
| 03 | Circuit Breaker | Opens after threshold → fast-fail → recovers after reset |
| 04 | Concurrency Limit | Burst traffic → 503 for excess requests |
| 05 | Load Shedding | High inflight → 503 from guard |
| 06 | Fallback Degradation | Pricing/availability fail → 200 with degraded data |
| 07 | Retry Backoff | Intermittent failures → retries succeed at higher latency |
| 08 | Recovery | Full chaos → clear → system returns to healthy |

## Safety

- Chaos mode is **only active** when `BFF_BACKEND=chaos` is explicitly set.
- Without it, the chaos controller doesn't exist (404 on `/chaos/*`).
- A `WARN` log is emitted at startup: `CHAOS BACKEND ACTIVE — not for production use`.
- The chaos controller is exempt from load shedding so it's always reachable.
