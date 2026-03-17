/**
 * Scenario 01: Baseline — Happy Path Under Load
 *
 * Purpose: Establish normal performance metrics with no chaos injection.
 * All requests should succeed with low latency.
 *
 * What it proves:
 * - BFF works end-to-end with the chaos backend (no injection active)
 * - Baseline p95/p99 latency for comparison with failure scenarios
 * - Error rate is effectively zero under moderate load
 */

import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "../lib/config.js";
import { resetChaos } from "../lib/chaos-api.js";

export const options = {
  scenarios: {
    baseline: {
      executor: "ramping-vus",
      startVUs: 1,
      stages: [
        { duration: "10s", target: 30 },
        { duration: "20s", target: 30 },
        { duration: "5s", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    http_req_failed: ["rate<0.01"],
  },
};

export function setup() {
  resetChaos();
}

const endpoints = [
  ENDPOINTS.layout,
  ENDPOINTS.home,
  ENDPOINTS.categories,
  ENDPOINTS.search,
  ENDPOINTS.productDetail,
];

export default function () {
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(`${BASE_URL}${endpoint}`, {
    headers: DEFAULT_HEADERS,
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 500ms": (r) => r.timings.duration < 500,
    "has valid JSON body": (r) => {
      try {
        return r.json() !== null;
      } catch {
        return false;
      }
    },
  });

  sleep(0.1);
}
