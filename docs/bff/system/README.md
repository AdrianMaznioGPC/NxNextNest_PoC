# BFF System Domain

## Purpose

Contains cross-cutting runtime concerns for the BFF: caching policy, load shedding, timeouts, and observability.

## Key Files

- `apps/bff/src/modules/system/cache-policy.service.ts`
- `apps/bff/src/modules/system/load-shedding.service.ts`
- `apps/bff/src/modules/system/resilience.service.ts`
- `apps/bff/src/modules/system/scalability-metrics.service.ts`

## Inputs And Outputs

- Inputs: route kind, latency budgets, execution functions
- Outputs: runtime control decisions, metrics, and cache hints

## Notes

- `bootstrap-orchestrator.service.ts` uses these services to keep page assembly reliable under load.
