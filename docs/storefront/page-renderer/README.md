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

## Rendering Flow

1. `ResolvedPageRendererV2` receives the BFF slot manifest and renders slots in priority order, with `critical` slots before `deferred` slots.
2. Each slot is passed through `SlotBoundary`, which decides whether the slot can be rendered from inline props or needs to fetch a deferred slot payload.
3. Deferred slots call `getSlotPayload(slot.slotRef)` and can stream through `Suspense` when the slot manifest marks them as deferred.
4. `loadSlotRenderer()` uses the `rendererKey` plus `presentation.variantKey` to import the matching server component from the registry.
5. If a variant is unknown, the renderer registry falls back to the default variant for that renderer. If the payload fetch fails, the boundary falls back to `SlotFallback`.

## Inputs And Outputs

- Inputs: `PageBootstrapModel.slots`, deferred slot payloads, `presentation.variantKey`, `presentation.layoutKey`, and slot flags
- Outputs: rendered page content assembled from slots

## Variant Contract

- The BFF experience layer decides which variant key should be attached to each slot.
- The renderer registry is the storefront-side contract that must stay in sync with the allowed variants in the BFF experience catalog.
- Current examples include list-style category/search renderers and checkout flow variants such as `single-page`, `multi-step`, and `express`.
- Payload-provided presentation can refine the chosen variant, but the renderer key remains the primary lookup key.

## Operational Notes

- Renderer key mismatches between the manifest and fetched payload are logged as warnings.
- Missing `slotRef` values and failed deferred fetches degrade to `SlotFallback` rather than crashing the page.
- This layer is intentionally thin: it resolves components and data boundaries, while the actual layout logic lives inside the slot implementations.

## Notes

- This is the main FE counterpart to BFF `page-data` orchestration.
- See also [`../../page-pipeline.md`](../../page-pipeline.md).
