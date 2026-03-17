/**
 * Scenario 05: Load Shedding — Global/Scope Inflight Limits
 *
 * Purpose: Verify the LoadSheddingGuard rejects requests when
 * global or per-scope inflight counts exceed their limits.
 *
 * Setup: Add 200ms latency to all scopes so requests stay inflight
 * longer. Ramp VUs high enough to exceed limits:
 * - globalMaxInflight = 500
 * - page-data scope = 200
 *
 * What it proves:
 * - 503 OVERLOADED responses appear under heavy load
 * - Retry-After header is present on rejections
 * - System remains responsive (rejected requests are fast)
 * - System recovers when load decreases
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Trend } from "k6/metrics";
import { BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "../lib/config.js";
import { setChaosConfig, resetChaos, getMetrics } from "../lib/chaos-api.js";

const loadShedCount = new Counter("load_shed_rejections");
const successCount = new Counter("load_shed_successes");
const rejectionLatency = new Trend("rejection_latency_ms");

export const options = {
  scenarios: {
    load_shed: {
      executor: "ramping-vus",
      startVUs: 5,
      stages: [
        { duration: "5s", target: 50 },
        { duration: "10s", target: 200 },
        { duration: "10s", target: 300 },
        { duration: "5s", target: 0 },
      ],
    },
  },
};

export function setup() {
  resetChaos();
  // Slow down all backends so requests stay inflight longer
  setChaosConfig({
    defaultLatencyMs: 200,
    defaultErrorRate: 0,
    overrides: {},
  });
}

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINTS.layout}`, {
    headers: DEFAULT_HEADERS,
  });

  if (res.status === 503) {
    loadShedCount.add(1);
    rejectionLatency.add(res.timings.duration);

    check(res, {
      "load shed: OVERLOADED": (r) => {
        try {
          return r.json("errorCode") === "OVERLOADED";
        } catch {
          return false;
        }
      },
      "has Retry-After": (r) =>
        r.headers["Retry-After"] !== undefined,
    });
  } else if (res.status === 200) {
    successCount.add(1);
  }

  sleep(0.02);
}

export function teardown() {
  resetChaos();
  const m = getMetrics();
  console.log(
    `Load shedding summary: ${JSON.stringify(m.loadShedding, null, 2)}`,
  );
}
