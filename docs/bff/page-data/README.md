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

## Bootstrap Flow

1. `BootstrapOrchestratorService.buildBootstrap()` resolves locale context and recognizes the incoming route.
2. Experience is resolved before assembly so page assemblers can react to the chosen profile, signals, hero overrides, and checkout preferences.
3. Merchandising is resolved next and may rewrite query defaults such as sort order before assembly runs.
4. The matching page assembler produces the route-specific page content model and revalidation tags.
5. `SlotPlannerService` turns the resolved page into a slot manifest.
6. Experience then adjusts slot presentation and inclusion rules.
7. Merchandising applies its own slot-level changes after experience.
8. Link localization normalizes both page content and slots before the final `PageBootstrapModel` is returned.

## Inputs And Outputs

- Inputs: request path, query, locale context, cookie header, route metadata
- Outputs: `PageBootstrapModel`, `SlotPayloadModel`, and route-specific resolved pages

## Assembler Responsibilities

- Assemblers own route-specific data fetching and page node construction.
- Assemblers can use the resolved experience input to shape the content they emit.
- The homepage assembler applies `blockOverrides` via the generic `BlockOverlayService` to raw CMS blocks before resolution.
- The checkout assembler can promote the checkout flow to `express` by reading the resolved `page.checkout-main` variant from experience.
- Assemblers should return stable revalidation tags because those tags are further enriched downstream by experience and merchandising.

## Important Boundaries

- Route recognition decides what page kind the request is. It does not choose FE variants.
- Experience chooses presentation-level differences such as slot variants, layout keys, and safe marketing overlays.
- Merchandising chooses catalog-oriented behavior such as default sort preferences and merchandising mode.
- The storefront consumes the final bootstrap contract and should not have to reconstruct these BFF decisions.

## Failure Modes

- Unknown routes and missing assemblers collapse to the BFF not-found response.
- Cart routes are blocked when the resolved experience store context is not configured for page-based cart UX.
- Assembler timeouts and assembly failures are caught by the resilience layer and currently degrade to not-found rather than leaking backend errors.

## Notes

- This is the main BFF composition layer for page bootstrap responses.
- See also [`../../page-pipeline.md`](../../page-pipeline.md).
