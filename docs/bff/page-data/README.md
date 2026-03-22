# BFF Page Data Domain

## Purpose
This is the core page orchestration domain in the BFF. It recognizes routes, assembles page models, plans slots, applies experience and merchandising, and returns the final bootstrap contract used by the storefront.

## Key Files
- `apps/bff/src/modules/page-data/bootstrap-orchestrator.service.ts`
- `apps/bff/src/modules/page-data/page-data.controller.ts`
- `apps/bff/src/modules/page-data/page-data.service.ts`
- `apps/bff/src/modules/page-data/slot-planner.service.ts`
- `apps/bff/src/modules/page-data/slot-data.service.ts`
- `apps/bff/src/modules/page-data/assemblers/*`
- `apps/bff/src/modules/page-data/routing/*`

## Inputs And Outputs
- Inputs: request path, query, locale context, cookie header, route metadata
- Outputs: `PageBootstrapModel`, `SlotPayloadModel`, and route-specific resolved pages

## Notes
- This is the main BFF experience composition layer.
- See also [`../../page-pipeline.md`](../../page-pipeline.md).