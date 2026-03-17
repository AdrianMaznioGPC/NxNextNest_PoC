# Error Handling

## Overview

Errors flow from the BFF to the storefront as structured JSON responses. The storefront maps error codes to translated user-facing messages. The system is designed so that the user never sees a raw error message or stack trace.

## BFF Error Response Contract

All errors from the BFF follow the `BffErrorResponse` shape from `@commerce/shared-types`:

```typescript
type BffErrorResponse = {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: Record<string, unknown>;
};
```

## BFF Error Filter (`bff-error.filter.ts`)

A global `@Catch()` exception filter that handles all uncaught exceptions:

| Exception Type | Status | Error Code | Retry-After |
|---------------|--------|------------|-------------|
| `TimeoutPolicyError` | 504 | `UPSTREAM_TIMEOUT` | 2s |
| `CircuitOpenError` | 503 | `CIRCUIT_OPEN` | 5s |
| `ConcurrencyLimitError` | 503 | `CONCURRENCY_LIMIT` | 2s |
| `HttpException` (NestJS) | Varies | Derived from status | — |
| `Error` (generic) | 500 | `INTERNAL_ERROR` | — |

For `HttpException`, the filter extracts the response body and maps it:
- String response → used as message.
- Object response → extracts `message` (joins arrays with "; "), `error`, `errorCode`.
- If the exception response includes `retryAfterSeconds`, it's set as the `Retry-After` header.

### Load Shedding Errors

The `LoadSheddingGuard` throws `ServiceUnavailableException` with an `errorCode` of `OVERLOADED` and a `retryAfterSeconds` field. The error filter picks this up and returns 503 with the `Retry-After` header.

## Storefront Error Handling

### BffError Class (`lib/api/index.ts`)

```typescript
class BffError extends Error {
  constructor(public readonly response: BffErrorResponse) {
    super(response.message);
  }
}
```

`bffFetch()` throws `BffError` for any non-OK response. It also extracts the `Retry-After` header into `response.details.retryAfterSeconds`.

### Server Action Error Mapping (`components/cart/actions.ts`)

Cart server actions catch `BffError` and return translated messages:

| Error Code | Translation Key | User Message |
|-----------|----------------|-------------|
| `CIRCUIT_OPEN` | `error.serviceUnavailable` | "Service temporarily unavailable" |
| `CONCURRENCY_LIMIT` | `error.serviceUnavailable` | "Service temporarily unavailable" |
| `OVERLOADED` | `error.serviceUnavailable` | "Service temporarily unavailable" |
| `UPSTREAM_TIMEOUT` | `error.upstreamTimeout` | "Request timed out" |
| `ITEMS_NOT_PURCHASABLE` | `error.itemNotPurchasable` | "Item is not available for purchase" |
| Other | — | Uses `error.response.message` directly |

### Page-Level Error Handling

- **Product/category pages** wrap `getProductPageData()` / `getCategoryPageData()` in try/catch. On any error, they call `notFound()` to render the 404 page.
- **Cart reads** (`getCart()`) catch all errors and return `undefined` (cart is non-critical for page rendering).
- **Checkout** redirects to home if the cart is empty or missing.

## Design Decisions

- **Resilience errors are never retried by the frontend.** The BFF's resilience layer handles retries. By the time an error reaches the frontend, retries have been exhausted or the circuit is open.
- **`Retry-After` is informational.** The storefront doesn't auto-retry. The header is available for infrastructure (load balancers, CDNs) or future retry logic.
- **Error codes are stable identifiers.** Messages are translated per locale. The frontend switches on `errorCode`, never on `message`.
- **Graceful degradation is invisible.** When pricing/availability ports fail with fallbacks, the BFF still returns 200. Products show as "Currently Unavailable" with no price — the user sees a degraded page, not an error.
