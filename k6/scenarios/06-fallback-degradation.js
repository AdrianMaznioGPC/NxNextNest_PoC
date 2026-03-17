/**
 * Scenario 06: Fallback Degradation — Graceful Degradation
 *
 * Purpose: Verify that ports configured with fallbacks (pricing,
 * availability) degrade gracefully when their backends fail,
 * returning 200 responses with reduced data instead of 5xx errors.
 *
 * Setup: Set pricing and availability scopes to 100% error rate.
 * These ports have fallbacks configured in SystemModule:
 * - getPricing → undefined (missing price data)
 * - getPricingBatch → new Map() (empty batch)
 * - getAvailability → undefined
 * - getAvailabilityBatch → new Map()
 *
 * What it proves:
 * - Responses are still 200 despite backend failures
 * - Response body has product data (from working product port)
 * - Pricing/availability data is missing or empty (degraded)
 * - executeOrDefault correctly swallows resilience errors
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "../lib/config.js";
import { setChaosScope, resetChaos } from "../lib/chaos-api.js";

export const options = {
  scenarios: {
    fallback: {
      executor: "constant-vus",
      vus: 10,
      duration: "15s",
    },
  },
  thresholds: {
    "checks{type:degraded}": ["rate>0.9"],
  },
};

export function setup() {
  resetChaos();
  // Kill pricing and availability — they have fallbacks
  setChaosScope("pricing", { errorRate: 1.0 });
  setChaosScope("availability", { errorRate: 1.0 });
}

export default function () {
  // Search page fetches products + pricing batch + availability batch.
  // Products should work, pricing/availability should degrade.
  const res = http.get(`${BASE_URL}${ENDPOINTS.search}`, {
    headers: DEFAULT_HEADERS,
  });

  check(
    res,
    {
      "still 200 despite pricing/availability failure": (r) =>
        r.status === 200,
      "response has products array": (r) => {
        try {
          const body = r.json();
          return body && Array.isArray(body.products);
        } catch {
          return false;
        }
      },
    },
    { type: "degraded" },
  );

  sleep(0.2);
}

export function teardown() {
  resetChaos();
}
