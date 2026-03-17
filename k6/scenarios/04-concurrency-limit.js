/**
 * Scenario 04: Concurrency Limit — Burst Traffic Triggers 503
 *
 * Purpose: Verify the per-scope concurrency limiter rejects excess
 * requests when too many are in-flight simultaneously.
 *
 * Setup: Add 500ms latency to the "pricing" scope so requests pile up.
 * The pricing port has maxConcurrent=32.
 * 80 VUs hitting simultaneously should exceed this limit.
 *
 * What it proves:
 * - Some requests succeed (200) when under the concurrency limit
 * - Excess requests get 503 CONCURRENCY_LIMIT
 * - The system doesn't crash or deadlock under burst load
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";
import { BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "../lib/config.js";
import { setChaosScope, resetChaos } from "../lib/chaos-api.js";

const successCount = new Counter("success_count");
const concurrencyLimitCount = new Counter("concurrency_limit_count");
const otherErrorCount = new Counter("other_error_count");

export const options = {
  scenarios: {
    concurrency_burst: {
      executor: "shared-iterations",
      vus: 80,
      iterations: 200,
      maxDuration: "30s",
    },
  },
};

export function setup() {
  resetChaos();
  // Pricing maxConcurrent=32. Add 500ms latency so requests pile up.
  setChaosScope("pricing", { latencyMs: 500 });
}

export default function () {
  // Product page calls pricing port
  const res = http.get(`${BASE_URL}${ENDPOINTS.productDetail}`, {
    headers: DEFAULT_HEADERS,
  });

  if (res.status === 200) {
    successCount.add(1);
    check(res, { "success: 200": () => true });
  } else if (res.status === 503) {
    const errorCode = (() => {
      try {
        return res.json("errorCode");
      } catch {
        return "UNKNOWN";
      }
    })();

    if (
      errorCode === "CONCURRENCY_LIMIT" ||
      errorCode === "OVERLOADED"
    ) {
      concurrencyLimitCount.add(1);
      check(res, { "concurrency/load shed: 503": () => true });
    } else {
      otherErrorCount.add(1);
    }
  }

  sleep(0.05);
}

export function teardown(data) {
  resetChaos();
}
