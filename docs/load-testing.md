# Load Testing the BFF Resilience Layer

## Overview

The BFF resilience layer (timeouts, circuit breakers, retries, concurrency limits, load shedding, fallback degradation) is tested using [k6](https://k6.io/) with a custom **ChaosBackendModule** that injects configurable failures into the mock adapters.

### Architecture

```
k6 (HTTP load) ──→ BFF (:4000) ──→ SystemModule (resilience proxies)
                       │                    │
                       │              ChaosBackendModule
                       │                    │
                       │           ChaosProxy (latency/errors/hangs)
                       │                    │
                       ▼              MockAdapters (real data)
                 /chaos/* endpoints
                 (live control plane)
```

The **ChaosBackendModule** replaces the standard `MockBackendModule` at boot time. It wraps every mock adapter with a `Proxy` that can inject:

- **Latency** — artificial delay per call (tests concurrency piling)
- **Errors** — random failures with configurable probability (tests retries, circuit breaker)
- **Hangs** — never-resolving promises (tests timeout policy)

k6 scripts dynamically control failure modes via the `/chaos/*` HTTP endpoints during test execution.

---

## Prerequisites

### Install k6

```bash
# macOS
brew install k6

# Or verify installation
k6 version
```

### Start the BFF in chaos mode

```bash
BFF_BACKEND=chaos npx nx run bff:dev
```

You should see:

```
WARN [AppModule] CHAOS BACKEND ACTIVE — not for production use
...
Mapped {/chaos/config, GET} route
Mapped {/chaos/config, PUT} route
Mapped {/chaos/config/:scope, PUT} route
Mapped {/chaos/reset, POST} route
...
BFF running on http://localhost:4000
```

Verify it's working:

```bash
curl http://localhost:4000/chaos/config
# → {"defaultLatencyMs":5,"defaultErrorRate":0,"overrides":{}}

curl http://localhost:4000/health/live
# → {"status":"ok"}
```

---

## Running Tests

### Run a single scenario

```bash
k6 run k6/scenarios/01-baseline.js
```

### Run with JSON output (for analysis)

```bash
mkdir -p results
k6 run --out json=results/baseline.json k6/scenarios/01-baseline.js
```

### Run with web dashboard

```bash
K6_WEB_DASHBOARD=true k6 run k6/scenarios/01-baseline.js
```

Opens a live dashboard at `http://localhost:5665`. After the test completes, press **Enter** in the terminal to dismiss and see the full summary.

### Run all scenarios sequentially

```bash
./k6/run-all.sh
```

### Override the BFF URL

```bash
BFF_URL=http://my-host:4000 k6 run k6/scenarios/01-baseline.js
BFF_URL=http://my-host:4000 ./k6/run-all.sh
```

---

## Scenarios

| #   | Name                 | Mechanism Tested          | Duration | What It Proves                                                                |
| --- | -------------------- | ------------------------- | -------- | ----------------------------------------------------------------------------- |
| 01  | Baseline             | None (sanity check)       | ~35s     | Happy-path p95 latency, near-zero error rate                                  |
| 02  | Timeout              | Timeout + circuit breaker | ~20s     | Hanging backends → 504 `UPSTREAM_TIMEOUT`, then circuit trips → 503 fast-fail |
| 03  | Circuit Breaker      | Circuit breaker lifecycle | ~60s     | Opens after threshold → fast-fail 503 → recovers after reset                  |
| 04  | Concurrency Limit    | `maxConcurrent`           | ~30s     | Burst traffic → 503 `CONCURRENCY_LIMIT` for excess requests                   |
| 05  | Load Shedding        | All concurrency limits    | ~30s     | High inflight → 503 from port concurrency or load shedding guard              |
| 06  | Fallback Degradation | `executeOrDefault`        | ~15s     | Pricing/availability fail → still 200 with `$0.00` prices                     |
| 07  | Retry Backoff        | Retry + circuit breaker   | ~20s     | Intermittent failures → retries succeed → p95 ~5x baseline                    |
| 08  | Recovery             | All mechanisms            | ~90s     | Full chaos → clear → system returns to healthy                                |

> Scenarios 03 and 08 include a ~30s wait for circuit breaker reset (`circuitResetMs=30000`).

---

## Reading Results

### Terminal output

After each scenario, k6 prints a summary:

```
     ✓ status is 200
     ✓ response time < 500ms
     ✗ has valid JSON body
      ↳  99% — ✓ 4812 / ✗ 3

     checks.........................: 99.98% ✓ 14439  ✗ 3
     http_req_duration..............: avg=23ms min=1ms med=18ms max=312ms p(90)=45ms p(95)=67ms
     http_req_failed................: 0.02%  ✓ 3      ✗ 14439
     http_reqs......................: 14442  263/s
```

**Key metrics:**

- **checks** — assertion pass/fail counts and percentage
- **http_req_duration** — latency percentiles (p50, p90, p95, p99)
- **http_req_failed** — error rate
- **thresholds** — ✓ or ✗ (k6 exits with code 99 if a threshold fails)

### Web dashboard (live charts)

```bash
K6_WEB_DASHBOARD=true k6 run k6/scenarios/01-baseline.js
```

Opens a real-time browser dashboard at `http://localhost:5665`. After the test completes, press **Enter** to dismiss and see the terminal summary. To also save an HTML report:

```bash
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=results/baseline.html \
  k6 run k6/scenarios/01-baseline.js
```

### JSON output (for scripted analysis)

```bash
mkdir -p results
k6 run --out json=results/baseline.json k6/scenarios/01-baseline.js
```

### CSV output

```bash
mkdir -p results
k6 run --out csv=results/baseline.csv k6/scenarios/01-baseline.js
```

---

## Chaos Control Plane

The `/chaos/*` endpoints let you change failure modes while the BFF is running.

### Endpoints

| Method | Path                   | Description                                |
| ------ | ---------------------- | ------------------------------------------ |
| `GET`  | `/chaos/config`        | Get current chaos configuration            |
| `PUT`  | `/chaos/config`        | Replace entire chaos configuration         |
| `PUT`  | `/chaos/config/:scope` | Update a single scope's config             |
| `POST` | `/chaos/reset`         | Reset all chaos to defaults (no injection) |

### Scope names

Scopes match the resilience policy names:

`pricing`, `availability`, `product`, `collection`, `cms`, `navigation`, `menu`, `page`, `customer`, `cart`, `checkout`, `order`

### Examples

```bash
# Add 500ms latency to pricing
curl -X PUT http://localhost:4000/chaos/config/pricing \
  -H "Content-Type: application/json" \
  -d '{"latencyMs": 500}'

# 100% error rate on collection
curl -X PUT http://localhost:4000/chaos/config/collection \
  -H "Content-Type: application/json" \
  -d '{"errorRate": 1.0}'

# Make product port hang forever (timeout test)
curl -X PUT http://localhost:4000/chaos/config/product \
  -H "Content-Type: application/json" \
  -d '{"hangForever": true}'

# Set global defaults
curl -X PUT http://localhost:4000/chaos/config \
  -H "Content-Type: application/json" \
  -d '{"defaultLatencyMs": 100, "defaultErrorRate": 0.1}'

# Reset everything (must include a JSON body)
curl -X POST http://localhost:4000/chaos/reset \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Observing Resilience Behavior

### Health endpoints

While tests are running, monitor the BFF health:

```bash
# Liveness — always ok if process is running
curl http://localhost:4000/health/live

# Readiness — 503 if critical circuits (product, pricing, collection) are open
curl http://localhost:4000/health/ready

# Full metrics — latency percentiles, circuit states, load shedding stats
curl http://localhost:4000/health/metrics | python3 -m json.tool
```

### What to look for per scenario

| Scenario               | Expected behavior                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| **01 Baseline**        | All 200s, low latency, no circuit activity                                                         |
| **02 Timeout**         | First ~5 requests: 504 after ~6s (timeout + retry). Then circuit trips → remaining get instant 503 |
| **03 Circuit Breaker** | Initial 500s → 503 `CIRCUIT_OPEN` (fast, <1ms) → 200s after 30s reset                              |
| **04 Concurrency**     | Mix of 200s (~1000ms) and 503 `CONCURRENCY_LIMIT` (~8ms). Bimodal latency                          |
| **05 Load Shedding**   | 503s from port concurrency limits or load shedding guard. ~20x faster than served requests         |
| **06 Fallback**        | All 200s despite pricing/availability errors. Products present with `$0.00` prices                 |
| **07 Retry**           | ~42% succeed, ~47% circuit-open 503, ~11% exhausted retries. p95 is ~5x baseline                   |
| **08 Recovery**        | Phase 2 = errors, Phase 5 = all 200s, readiness returns to 200                                     |

---

## File Structure

```
k6/
├── lib/
│   ├── config.js          # Base URL, headers, endpoint constants
│   └── chaos-api.js       # Helpers to call /chaos/* endpoints
├── scenarios/
│   ├── 01-baseline.js
│   ├── 02-timeout.js
│   ├── 03-circuit-breaker.js
│   ├── 04-concurrency-limit.js
│   ├── 05-load-shedding.js
│   ├── 06-fallback-degradation.js
│   ├── 07-retry-backoff.js
│   └── 08-recovery.js
└── run-all.sh             # Sequential runner

apps/bff/src/adapters/chaos/
├── chaos-backend.module.ts    # NestJS module (replaces MockBackendModule)
├── chaos-config.service.ts    # Mutable config singleton
├── chaos.controller.ts        # HTTP control plane (/chaos/*)
└── create-chaos-adapter.ts    # Proxy factory for chaos injection
```

---

## Observed Results

Baseline numbers from local testing (results vary by machine):

| Scenario               | Key Observation                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| **01 Baseline**        | p95=24ms, 0% errors, 205 req/s                                                           |
| **02 Timeout**         | 3.6% got 504 (actual timeouts), 96.4% got 503 (circuit tripped and fast-failed the rest) |
| **03 Circuit Breaker** | 12/12 checks passed. Fast-fail at 0.7ms. Full recovery after 32s                         |
| **04 Concurrency**     | 9% served (1017ms avg), 91% rejected (8ms avg). Limiter is binary: in or out             |
| **05 Load Shedding**   | 96.4% shed at 11ms avg vs 224ms for served. System never crashed                         |
| **06 Fallback**        | 98.6% returned 200 with degraded data ($0.00 prices)                                     |
| **07 Retry**           | p95 went from 24ms to 121ms (5x). Backoff delay clearly visible in latency distribution  |
| **08 Recovery**        | Full lifecycle: healthy → broken → recovered. All checks passed                          |

---

## Safety

- The `ChaosBackendModule` and `/chaos/*` endpoints are **only available** when `BFF_BACKEND=chaos` is set
- Without this env var, the BFF uses `MockBackendModule` and the chaos controller does not exist (404)
- A prominent `WARN` log is emitted at startup when chaos mode is active
- The chaos controller is exempt from load shedding so it remains accessible even when the system is overloaded
