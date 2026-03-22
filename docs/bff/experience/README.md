# BFF Experience Domain

## Purpose
Resolves store and route-specific experience configuration. It chooses layout keys, theme bindings, slot variants, and whether slots should be included.

## Key Files
- `apps/bff/src/modules/experience/experience-profile.catalog.ts`
- `apps/bff/src/modules/experience/experience-profile.service.ts`
- `apps/bff/src/modules/experience/experience-resolver.service.ts`
- `apps/bff/src/modules/experience/experience-validator.service.ts`
- `apps/bff/src/modules/experience/experience-profile.types.ts`

## Inputs And Outputs
- Inputs: locale context, route kind, store context
- Outputs: resolved experience profiles plus slot presentation overrides

## Notes
- `bootstrap-orchestrator.service.ts` resolves experience before slot rendering.
- `applyToSlots()` is where FE composition is currently influenced from the BFF.