# BFF System Domain

## Purpose

Contains **cross-cutting runtime infrastructure** for the BFF. These services wrap the bootstrap and slot pipelines with load protection, caching policy, timeout management, and observability.

## Key Files

| File                             | Role                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `cache-policy.service.ts`        | Generates `Cache-Control`, `ETag`, `Vary`, and `X-Request-Id` headers per route kind |
| `load-shedding.service.ts`       | Limits concurrent inflight requests; returns `503 Retry-After` when overloaded       |
| `resilience.service.ts`          | Wraps operations with timeouts and retry logic                                       |
| `scalability-metrics.service.ts` | Tracks route/slot metrics, merchandising resolution timing                           |

## Load Shedding

The BFF protects itself from overload using inflight request limits:

| Config                          | Default | Scope                  |
| ------------------------------- | ------- | ---------------------- |
| `BOOTSTRAP_MAX_INFLIGHT`        | `256`   | Bootstrap endpoint     |
| `BOOTSTRAP_RETRY_AFTER_SECONDS` | `2`     | 503 Retry-After header |
| `SLOT_MAX_INFLIGHT`             | `512`   | Slot endpoint          |
| `SLOT_RETRY_AFTER_SECONDS`      | `2`     | 503 Retry-After header |

When the limit is exceeded, the BFF returns `503 Service Unavailable` with a `Retry-After` header.

## Cache Behavior

Bootstrap and slot responses include:

- `ETag` derived from content
- `Cache-Control` with `max-age` and `stale-while-revalidate`
- `Vary` headers for content negotiation
- `X-Request-Id` for tracing
- Cache tags that include content, language, experience, theme, and merchandising dimensions

## Interactions

- **Bootstrap Orchestrator**: Uses resilience service to wrap assembly with timeouts; uses load shedding to reject excess traffic
- **Slot Data Service**: Same load shedding and resilience patterns
- **Diagnostics**: `INCLUDE_TIMINGS_IN_RESPONSE=true` adds timing breakdowns to responses
