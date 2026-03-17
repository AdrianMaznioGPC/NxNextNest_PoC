import type { ResiliencePolicy } from "./resilience.types";

/** Reads: fast, retryable, non-critical if unavailable. */
export const PRICING_POLICY: ResiliencePolicy = {
  timeoutMs: 2000,
  retries: 2,
  retryBackoffMs: 50,
  maxConcurrent: 32,
  circuitFailureThreshold: 5,
  circuitResetMs: 30_000,
};

/** Reads: fast, retryable, non-critical if unavailable. */
export const AVAILABILITY_POLICY: ResiliencePolicy = {
  timeoutMs: 2000,
  retries: 2,
  retryBackoffMs: 50,
  maxConcurrent: 32,
  circuitFailureThreshold: 5,
  circuitResetMs: 30_000,
};

/** Product catalog reads: moderate timeout, one retry. */
export const PRODUCT_POLICY: ResiliencePolicy = {
  timeoutMs: 3000,
  retries: 1,
  retryBackoffMs: 100,
  maxConcurrent: 64,
  circuitFailureThreshold: 5,
  circuitResetMs: 30_000,
};

/** Collection reads: moderate timeout, one retry. */
export const COLLECTION_POLICY: ResiliencePolicy = {
  timeoutMs: 3000,
  retries: 1,
  retryBackoffMs: 100,
  maxConcurrent: 64,
  circuitFailureThreshold: 5,
  circuitResetMs: 30_000,
};

/** CMS reads: moderate timeout, one retry. */
export const CMS_POLICY: ResiliencePolicy = {
  timeoutMs: 3000,
  retries: 1,
  retryBackoffMs: 100,
  maxConcurrent: 32,
  circuitFailureThreshold: 3,
  circuitResetMs: 30_000,
};

/** Navigation reads: fast, one retry. */
export const NAVIGATION_POLICY: ResiliencePolicy = {
  timeoutMs: 2000,
  retries: 1,
  retryBackoffMs: 50,
  maxConcurrent: 32,
  circuitFailureThreshold: 3,
  circuitResetMs: 30_000,
};

/** Menu reads: fast, one retry. */
export const MENU_POLICY: ResiliencePolicy = {
  timeoutMs: 2000,
  retries: 1,
  retryBackoffMs: 50,
  maxConcurrent: 32,
  circuitFailureThreshold: 3,
  circuitResetMs: 30_000,
};

/** Page reads: moderate, one retry. */
export const PAGE_POLICY: ResiliencePolicy = {
  timeoutMs: 3000,
  retries: 1,
  retryBackoffMs: 100,
  maxConcurrent: 32,
  circuitFailureThreshold: 3,
  circuitResetMs: 30_000,
};

/** Customer reads/writes: moderate timeout, no retries for safety. */
export const CUSTOMER_POLICY: ResiliencePolicy = {
  timeoutMs: 5000,
  retries: 0,
  maxConcurrent: 64,
  circuitFailureThreshold: 5,
  circuitResetMs: 30_000,
};

/**
 * Cart mutations: longer timeout, zero retries (mutations must not be retried
 * without idempotency keys).
 */
export const CART_POLICY: ResiliencePolicy = {
  timeoutMs: 5000,
  retries: 0,
  maxConcurrent: 128,
  circuitFailureThreshold: 10,
  circuitResetMs: 30_000,
};

/**
 * Checkout: longer timeout, zero retries (payment-related,
 * must not be retried blindly).
 */
export const CHECKOUT_POLICY: ResiliencePolicy = {
  timeoutMs: 5000,
  retries: 0,
  maxConcurrent: 64,
  circuitFailureThreshold: 5,
  circuitResetMs: 30_000,
};

/** Order stub: moderate. */
export const ORDER_POLICY: ResiliencePolicy = {
  timeoutMs: 5000,
  retries: 0,
  maxConcurrent: 64,
  circuitFailureThreshold: 5,
  circuitResetMs: 30_000,
};
