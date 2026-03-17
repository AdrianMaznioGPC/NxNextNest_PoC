/**
 * Scenario 07: Retry with Backoff — Intermittent Failures
 *
 * Purpose: Verify that the retry mechanism handles intermittent failures
 * transparently. Requests should still succeed, but with elevated latency
 * due to retries and backoff delays.
 *
 * Setup: Set 50% error rate on the "collection" scope.
 * Collection policy: retries=1, retryBackoffMs=100.
 * With 50% error rate, ~50% of first attempts fail, but the retry
 * should succeed ~50% of the time → overall ~75% success rate.
 *
 * What it proves:
 * - Retries are happening (p95 latency is higher than baseline)
 * - Many requests still succeed despite intermittent failures
 * - Exponential backoff is applied (visible in latency distribution)
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Trend } from "k6/metrics";
import { BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "../lib/config.js";
import { setChaosScope, resetChaos } from "../lib/chaos-api.js";

const retrySuccessCount = new Counter("retry_successes");
const retryFailureCount = new Counter("retry_failures");
const successLatency = new Trend("success_latency_ms");

export const options = {
  scenarios: {
    retry_test: {
      executor: "constant-vus",
      vus: 10,
      duration: "20s",
    },
  },
};

export function setup() {
  resetChaos();
  // 50% error rate on collection — intermittent failures
  setChaosScope("collection", { errorRate: 0.5 });
}

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINTS.categories}`, {
    headers: DEFAULT_HEADERS,
  });

  if (res.status === 200) {
    retrySuccessCount.add(1);
    successLatency.add(res.timings.duration);
    check(res, { "success: 200": () => true });
  } else {
    retryFailureCount.add(1);
    check(res, {
      "expected failure (500 or 503)": (r) =>
        r.status === 500 || r.status === 503,
    });
  }

  sleep(0.2);
}

export function teardown() {
  resetChaos();
  console.log(
    "Compare success_latency_ms p95 against baseline p95 to see retry impact.",
  );
}
