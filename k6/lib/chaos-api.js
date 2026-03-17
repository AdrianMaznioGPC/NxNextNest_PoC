/**
 * k6 helpers for controlling the BFF chaos injection layer.
 *
 * These functions call the /chaos/* HTTP endpoints to dynamically
 * configure failure modes during a running test.
 */

import http from "k6/http";
import { BASE_URL, DEFAULT_HEADERS, JSON_HEADERS } from "./config.js";

/**
 * Replace the entire chaos configuration.
 * @param {Object} config - Full ChaosConfig object
 */
export function setChaosConfig(config) {
  const res = http.put(`${BASE_URL}/chaos/config`, JSON.stringify(config), {
    headers: JSON_HEADERS,
  });
  if (res.status !== 200) {
    console.error(`Failed to set chaos config: ${res.status} ${res.body}`);
  }
  return res;
}

/**
 * Update chaos config for a single port scope.
 * @param {string} scope - Port scope name (e.g., "pricing", "product")
 * @param {Object} config - Partial ScopeChaosConfig
 */
export function setChaosScope(scope, config) {
  const res = http.put(
    `${BASE_URL}/chaos/config/${scope}`,
    JSON.stringify(config),
    { headers: JSON_HEADERS },
  );
  if (res.status !== 200) {
    console.error(
      `Failed to set chaos scope "${scope}": ${res.status} ${res.body}`,
    );
  }
  return res;
}

/**
 * Reset all chaos injection to defaults (no failures).
 */
export function resetChaos() {
  const res = http.post(`${BASE_URL}/chaos/reset`, "{}", {
    headers: JSON_HEADERS,
  });
  if (res.status !== 200 && res.status !== 201) {
    console.error(`Failed to reset chaos: ${res.status} ${res.body}`);
  }
  return res;
}

/**
 * Fetch the /health/metrics snapshot.
 * @returns {Object} Parsed JSON metrics
 */
export function getMetrics() {
  const res = http.get(`${BASE_URL}/health/metrics`, {
    headers: DEFAULT_HEADERS,
  });
  return res.json();
}

/**
 * Fetch the /health/ready probe.
 * @returns {Object} k6 response
 */
export function getReadiness() {
  return http.get(`${BASE_URL}/health/ready`, {
    headers: DEFAULT_HEADERS,
  });
}
