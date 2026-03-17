/**
 * Shared k6 configuration constants.
 */

export const BASE_URL = __ENV.BFF_URL || "http://localhost:4000";

/** Headers for GET requests (no Content-Type needed). */
export const DEFAULT_HEADERS = {
  "x-store-code": "ie",
};

/** Headers for requests with a JSON body. */
export const JSON_HEADERS = {
  "x-store-code": "ie",
  "Content-Type": "application/json",
};

/** Common endpoints used across scenarios. */
export const ENDPOINTS = {
  layout: "/page-data/layout",
  home: "/page-data/home",
  categories: "/page-data/categories",
  categoryDetail: "/page-data/categories/cat-brakes",
  productDetail: "/page-data/product/p-1",
  search: "/page-data/search?q=brake",
  pages: "/page-data/pages",
  healthLive: "/health/live",
  healthReady: "/health/ready",
  healthMetrics: "/health/metrics",
};
