/**
 * Scenario 03: Circuit Breaker — Open, Fast-Fail, Recovery
 *
 * Purpose: Verify the circuit breaker lifecycle:
 * 1. Healthy requests succeed
 * 2. Sustained failures trip the circuit after the threshold
 * 3. While open, requests fast-fail without hitting the backend
 * 4. Readiness probe reports degraded state
 * 5. After reset period, circuit closes and requests succeed again
 *
 * Setup: Target the "collection" scope (circuitFailureThreshold=5, circuitResetMs=30s).
 *
 * What it proves:
 * - Circuit opens after N consecutive failures
 * - Open circuit returns 503 CIRCUIT_OPEN instantly (fast-fail)
 * - /health/ready returns 503 when critical circuits are open
 * - Circuit recovers after the reset period
 */

import http from "k6/http";
import { check, sleep, group } from "k6";
import { BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "../lib/config.js";
import { setChaosScope, resetChaos, getReadiness } from "../lib/chaos-api.js";

export const options = {
  scenarios: {
    circuit_test: {
      executor: "per-vu-iterations",
      vus: 1,
      iterations: 1,
      maxDuration: "120s",
    },
  },
};

export default function () {
  // ---------------------------------------------------------------
  // Phase 1: Verify healthy state
  // ---------------------------------------------------------------
  group("Phase 1: Healthy", () => {
    resetChaos();
    sleep(0.5);

    for (let i = 0; i < 3; i++) {
      const res = http.get(`${BASE_URL}${ENDPOINTS.categories}`, {
        headers: DEFAULT_HEADERS,
      });
      check(res, { "healthy: 200": (r) => r.status === 200 });
      sleep(0.2);
    }
  });

  // ---------------------------------------------------------------
  // Phase 2: Inject failures to trip the circuit
  // ---------------------------------------------------------------
  group("Phase 2: Trip circuit with failures", () => {
    // Collection: circuitFailureThreshold=5, retries=1
    // Each request generates 1 attempt + 1 retry = 2 failures toward the threshold.
    // ~3 failing requests should trip it.
    setChaosScope("collection", { errorRate: 1.0 });
    sleep(0.5);

    let circuitTripped = false;

    for (let i = 0; i < 20; i++) {
      const res = http.get(`${BASE_URL}${ENDPOINTS.categories}`, {
        headers: DEFAULT_HEADERS,
      });

      if (res.status === 503) {
        try {
          const errorCode = res.json("errorCode");
          if (errorCode === "CIRCUIT_OPEN") {
            circuitTripped = true;
            check(res, {
              "circuit opened: 503": (r) => r.status === 503,
              "errorCode is CIRCUIT_OPEN": (r) =>
                r.json("errorCode") === "CIRCUIT_OPEN",
              "has Retry-After header": (r) =>
                r.headers["Retry-After"] !== undefined,
            });
            break;
          }
        } catch {
          // JSON parse failed, continue
        }
      }

      sleep(0.3);
    }

    check(null, {
      "circuit breaker tripped": () => circuitTripped,
    });
  });

  // ---------------------------------------------------------------
  // Phase 3: Verify readiness probe shows degraded
  // ---------------------------------------------------------------
  group("Phase 3: Readiness probe", () => {
    const ready = getReadiness();
    check(ready, {
      "readiness returns 503 (degraded)": (r) => r.status === 503,
    });
  });

  // ---------------------------------------------------------------
  // Phase 4: Verify fast-fail while circuit is open
  // ---------------------------------------------------------------
  group("Phase 4: Fast-fail", () => {
    const start = Date.now();
    const res = http.get(`${BASE_URL}${ENDPOINTS.categories}`, {
      headers: DEFAULT_HEADERS,
    });
    const elapsed = Date.now() - start;

    check(res, {
      "fast-fail: 503": (r) => r.status === 503,
    });
    check(null, {
      "fast-fail latency < 100ms": () => elapsed < 100,
    });
  });

  // ---------------------------------------------------------------
  // Phase 5: Wait for circuit reset and verify recovery
  // ---------------------------------------------------------------
  group("Phase 5: Recovery", () => {
    // Remove failures first
    resetChaos();

    // Wait for circuit to transition to half-open (circuitResetMs=30s)
    console.log("Waiting 32s for circuit reset...");
    sleep(32);

    // The next request acts as a half-open probe
    const res = http.get(`${BASE_URL}${ENDPOINTS.categories}`, {
      headers: DEFAULT_HEADERS,
    });
    check(res, {
      "recovered: 200": (r) => r.status === 200,
    });

    // Readiness should also recover
    sleep(0.5);
    const ready = getReadiness();
    check(ready, {
      "readiness recovered: 200": (r) => r.status === 200,
    });
  });
}
