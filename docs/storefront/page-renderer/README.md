# Storefront Page Renderer Domain

## Purpose
Renders the BFF bootstrap contract. It maps slot manifests and renderer keys to actual React components.

## Key Files
- `apps/storefront/components/page-renderer/resolved-page-renderer-v2.tsx`
- `apps/storefront/components/page-renderer/slot-boundary.tsx`
- `apps/storefront/components/page-renderer/slot-renderer-registry.ts`
- `apps/storefront/components/page-renderer/slot-types.ts`
- `apps/storefront/components/page-renderer/slots/*`
- `apps/storefront/components/page-renderer/nodes/*`

## Inputs And Outputs
- Inputs: `PageBootstrapModel.slots`, deferred slot payloads, slot variants
- Outputs: rendered page content assembled from slots

## Notes
- This is the main FE counterpart to BFF `page-data` orchestration.
- See also [`../../page-pipeline.md`](../../page-pipeline.md).