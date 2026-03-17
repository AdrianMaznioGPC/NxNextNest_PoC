/**
 * Scenario 02: Timeout — Backend Hangs, BFF Returns 504
 *
 * Purpose: Verify the timeout policy cuts off hanging backend calls
 * and returns a structured 504 UPSTREAM_TIMEOUT error.
 *
 * Setup: Set the "pricing" scope to hangForever=true.
 * The pricing port has a 2000ms timeout policy.
 *
 * What it proves:
 * - Timeout policy fires after the configured threshold
 * - BFF returns 504 with errorCode "UPSTREAM_TIMEOUT"
 * - Retry-After header is present
 * - Requests don't hang indefinitely
 *
 * Note: Product page calls getProductPage which fetches pricing.
 * Since pricing has a fallback configured (getPricing → undefined),
 * the product page may still return 200 with missing pricing data.
 * We test the search endpoint instead, which exercises the full pipeline.
 * However, if all ports with fallbacks degrade gracefully, we test
 * a port WITHOUT a fallback — the collection port on category detail.
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "../lib/config.js";
import { setChaosScope, resetChaos } from "../lib/chaos-api.js";

export const options = {
  scenarios: {
    timeout_test: {
      executor: "constant-vus",
      vus: 5,
      duration: "20s",
    },
  },
  thresholds: {
    "checks{scenario:timeout_test}": ["rate>0.8"],
  },
};

export function setup() {
  resetChaos();
  // Collection port has 3000ms timeout, 1 retry.
  // hangForever means every call will timeout.
  setChaosScope("collection", { hangForever: true });
}

export default function () {
  // Category detail calls collection port → should timeout
  const res = http.get(`${BASE_URL}${ENDPOINTS.categoryDetail}`, {
    headers: DEFAULT_HEADERS,
    timeout: "15s", // k6 client timeout — must be > BFF timeout + retries
  });

  check(res, {
    "status is 504 (gateway timeout)": (r) => r.status === 504,
    "errorCode is UPSTREAM_TIMEOUT": (r) => {
      try {
        return r.json("errorCode") === "UPSTREAM_TIMEOUT";
      } catch {
        return false;
      }
    },
    "has Retry-After header": (r) =>
      r.headers["Retry-After"] !== undefined,
  });

  sleep(0.5);
}

export function teardown() {
  resetChaos();
}
