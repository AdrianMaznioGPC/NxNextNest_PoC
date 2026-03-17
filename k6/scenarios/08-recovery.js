/**
 * Scenario 08: Recovery — Full Chaos to Full Recovery
 *
 * Purpose: Verify the system fully recovers after all chaos is cleared.
 * Tests the complete lifecycle: healthy → broken → recovered.
 *
 * Phases:
 * 1. Confirm healthy baseline
 * 2. Break everything (100% error rate)
 * 3. Wait for circuits to open
 * 4. Clear chaos and wait for circuit reset
 * 5. Verify full recovery
 *
 * What it proves:
 * - System degrades under full failure
 * - Circuits open as expected
 * - After clearing failures and waiting for reset, all circuits close
 * - System returns to fully healthy state
 */

import http from "k6/http";
import { check, sleep, group } from "k6";
import { BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "../lib/config.js";
import {
  setChaosConfig,
  resetChaos,
  getMetrics,
  getReadiness,
} from "../lib/chaos-api.js";

export const options = {
  scenarios: {
    recovery: {
      executor: "per-vu-iterations",
      vus: 1,
      iterations: 1,
      maxDuration: "120s",
    },
  },
};

export default function () {
  // ---------------------------------------------------------------
  // Phase 1: Confirm healthy baseline
  // ---------------------------------------------------------------
  group("Phase 1: Healthy baseline", () => {
    resetChaos();
    sleep(0.5);

    for (let i = 0; i < 5; i++) {
      const res = http.get(`${BASE_URL}${ENDPOINTS.layout}`, {
        headers: DEFAULT_HEADERS,
      });
      check(res, { "baseline: 200": (r) => r.status === 200 });
      sleep(0.2);
    }

    const ready = getReadiness();
    check(ready, { "baseline readiness: 200": (r) => r.status === 200 });
  });

  // ---------------------------------------------------------------
  // Phase 2: Break everything
  // ---------------------------------------------------------------
  group("Phase 2: Full chaos", () => {
    setChaosConfig({
      defaultLatencyMs: 0,
      defaultErrorRate: 1.0,
      overrides: {},
    });
    sleep(0.5);

    // Drive enough requests to trip circuits
    for (let i = 0; i < 15; i++) {
      http.get(`${BASE_URL}${ENDPOINTS.layout}`, {
        headers: DEFAULT_HEADERS,
      });
      http.get(`${BASE_URL}${ENDPOINTS.categories}`, {
        headers: DEFAULT_HEADERS,
      });
      sleep(0.2);
    }

    // Verify things are broken
    const res = http.get(`${BASE_URL}${ENDPOINTS.layout}`, {
      headers: DEFAULT_HEADERS,
    });
    check(res, {
      "chaos: not 200": (r) => r.status !== 200,
    });
  });

  // ---------------------------------------------------------------
  // Phase 3: Verify degraded state
  // ---------------------------------------------------------------
  group("Phase 3: Verify degraded", () => {
    const metrics = getMetrics();
    console.log(
      "Circuits during chaos:",
      JSON.stringify(metrics.resilience?.circuits, null, 2),
    );
  });

  // ---------------------------------------------------------------
  // Phase 4: Clear chaos and wait for recovery
  // ---------------------------------------------------------------
  group("Phase 4: Wait for recovery", () => {
    resetChaos();
    console.log("Waiting 33s for all circuits to reset...");
    sleep(33);
  });

  // ---------------------------------------------------------------
  // Phase 5: Verify full recovery
  // ---------------------------------------------------------------
  group("Phase 5: Full recovery", () => {
    let allRecovered = true;

    for (let i = 0; i < 5; i++) {
      const res = http.get(`${BASE_URL}${ENDPOINTS.layout}`, {
        headers: DEFAULT_HEADERS,
      });
      if (res.status !== 200) {
        allRecovered = false;
      }
      check(res, { "recovered: 200": (r) => r.status === 200 });
      sleep(0.3);
    }

    // Check categories too (tests collection circuit recovery)
    for (let i = 0; i < 3; i++) {
      const res = http.get(`${BASE_URL}${ENDPOINTS.categories}`, {
        headers: DEFAULT_HEADERS,
      });
      check(res, {
        "categories recovered: 200": (r) => r.status === 200,
      });
      sleep(0.3);
    }

    // Readiness should be green
    const ready = getReadiness();
    check(ready, {
      "readiness recovered: 200": (r) => r.status === 200,
    });

    check(null, {
      "system fully recovered": () => allRecovered,
    });

    // Final metrics snapshot
    const metrics = getMetrics();
    console.log(
      "Circuits after recovery:",
      JSON.stringify(metrics.resilience?.circuits, null, 2),
    );
  });
}
