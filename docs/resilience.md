# Resilience Layer

## Overview

The BFF wraps every port adapter with a resilience proxy that applies timeout, retry, circuit breaker, and concurrency control policies. Domain services and controllers are unaware of resilience — they inject the standard port token and get a transparent proxy.

**Location:** `apps/bff/src/modules/system/`

## Architecture

```
Domain Service
     │
     │ injects PRODUCT_PORT
     ▼
Resilient Proxy (Proxy object)
     │
     │ ResilienceService.execute()
     ▼
Raw Adapter (MockProductAdapter)
```

### How It Works

1. `SystemModule.forRoot(backendModule)` wires everything.
2. The backend module (Mock or Chaos) provides adapters under `RAW_*` tokens.
3. `SystemModule` creates resilient proxies via `createResilientPort()` and publishes them under the standard port tokens (`PRODUCT_PORT`, `PRICING_PORT`, etc.).
4. Consumers inject the standard tokens and transparently get resilience.

### `createResilientPort()` (`resilient-port.factory.ts`)

Creates a JavaScript `Proxy` that intercepts every method call on a port and routes it through `ResilienceService`:

- **Without fallback:** Uses `resilience.execute()` — throws on failure.
- **With fallback:** Uses `resilience.executeOrDefault()` — returns the fallback value on any failure.

Fallbacks are configured per-method. For example, `PricingPort.getPricing` falls back to `undefined` (product renders without price), while `PricingPort.getPricingBatch` falls back to `() => new Map()` (empty map, products render without prices).

**Design decision:** Fallback values can be static or factory functions `() => T` for fresh instances. This prevents shared mutable state (e.g., a single `Map` instance being reused across calls).

## Policies (`resilience.policies.ts`)

Each port scope has a named policy:

| Policy | Timeout | Retries | Backoff | Max Concurrent | Circuit Threshold | Circuit Reset |
|--------|---------|---------|---------|----------------|-------------------|---------------|
| `PRICING_POLICY` | 2s | 2 | 50ms | 32 | 5 | 30s |
| `AVAILABILITY_POLICY` | 2s | 2 | 50ms | 32 | 5 | 30s |
| `PRODUCT_POLICY` | 3s | 1 | 100ms | 64 | 5 | 30s |
| `COLLECTION_POLICY` | 3s | 1 | 100ms | 64 | 5 | 30s |
| `CMS_POLICY` | 3s | 1 | 100ms | 32 | 3 | 30s |
| `NAVIGATION_POLICY` | 2s | 1 | 50ms | 32 | 3 | 30s |
| `MENU_POLICY` | 2s | 1 | 50ms | 32 | 3 | 30s |
| `PAGE_POLICY` | 3s | 1 | 100ms | 32 | 3 | 30s |
| `CUSTOMER_POLICY` | 5s | 0 | — | 64 | 5 | 30s |
| `CART_POLICY` | 5s | 0 | — | 128 | 10 | 30s |
| `CHECKOUT_POLICY` | 5s | 0 | — | 64 | 5 | 30s |
| `ORDER_POLICY` | 5s | 0 | — | 64 | 5 | 30s |

**Design decisions:**

- **Read ports** (pricing, availability, product, collection) have retries because reads are idempotent.
- **Write ports** (cart, checkout, customer) have **zero retries** because mutations must not be retried without idempotency keys.
- **Cart** has a higher circuit threshold (10) and concurrency limit (128) because it's the most frequently mutated resource.
- **CMS/navigation/menu** have a lower circuit threshold (3) because they're critical for page rendering.

## ResilienceService (`resilience.service.ts`)

Singleton service managing all resilience state:

### Timeout

Races the task promise against a `setTimeout`. If the timer wins, throws `TimeoutPolicyError`.

### Retry with Backoff

On failure, retries up to `policy.retries` times with linear backoff + jitter: `baseMs * attempt + random(0-9)ms`.

### Circuit Breaker

Tracks consecutive failures per scope key (e.g., `"pricing.getPricing"`):

- **Closed:** Normal operation. Failures increment the counter.
- **Open:** After `circuitFailureThreshold` consecutive failures. All calls immediately throw `CircuitOpenError` for `circuitResetMs`.
- **Half-Open:** After the reset period, the next call is allowed through as a probe. Success closes the circuit; failure reopens it.

### Concurrency Limiter

Tracks in-flight calls per scope key. If `maxConcurrent` is reached, immediately throws `ConcurrencyLimitError`.

### Graceful Degradation

`executeOrDefault()` catches **all** errors (resilience errors, upstream errors, connection failures) and returns a fallback value. Used for pricing and availability where degraded data is better than an error.

## Load Shedding (`load-shedding.guard.ts`)

A NestJS global guard that rejects requests when the BFF is overloaded:

- **Global limit:** 500 max in-flight requests.
- **Per-scope limits:** Configurable per route (e.g., `page-data: 200`, `cart: 150`, `sitemap: 5`).

Routes are tagged with `@SetMetadata('loadShedScope', 'page-data')`. When a limit is exceeded, returns 503 with `Retry-After`.

The guard registers a response cleanup callback to decrement counters when the response finishes (uses Fastify's `onResponse` hook).

**Design decision:** The health metrics endpoint is exempt from load shedding (`@SetMetadata(LOAD_SHED_SCOPE_KEY, undefined)`) so it remains accessible for diagnostics during overload.

## Cache Policy (`cache-policy.service.ts` / `cache-policy.interceptor.ts`)

Sets `Cache-Control` and `Vary` response headers based on route metadata:

- Routes are tagged with `@SetMetadata('cacheRouteKind', 'product-detail')`.
- The interceptor resolves the cache policy and sets headers after the response is computed.
- Mutable endpoints (cart, checkout, customers) use `no-store`.
- 404 responses get short cache times (15s max-age, 60s stale-while-revalidate).
- All responses include `Vary: x-store-code` since content differs by store.

## Metrics (`metrics.service.ts`)

In-process metrics collector with bounded memory (ring buffer of 2000 samples per key):

- **Request counts** — Per method/path/status.
- **Latency percentiles** — p50, p95, p99 per scope.
- **Error counts** — Per scope.

Exposed via `/health/metrics`. Designed to be replaceable by OpenTelemetry without changing consumers.

## Request Logging (`request-logger.interceptor.ts`)

Logs every request as a structured message: `GET /page-data/home 200 23ms`. Records request metrics (count + latency) via `MetricsService`.

## Health Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health/live` | Liveness probe. Returns `{"status":"ok"}` if the process is running. |
| `GET /health/ready` | Readiness probe. Returns 503 if critical circuits (product, pricing, collection) are open. |
| `GET /health/metrics` | Full diagnostics: resilience state, load shedding stats, latency percentiles. |
