# Winter Snowfall Effect

## What It Does

Adds an animated snowfall visual effect to the winter campaign homepage using the `react-snowfall` library.

## How to Activate

Visit the homepage with the winter campaign query parameter:

```
http://localhost:3000/?campaign=winter-2025
```

The snowfall effect will automatically appear as a full-screen overlay.

## Implementation

### Architecture

- **Block Type**: `winter-effects` (CMS block)
- **Rendering**: Client-side only (SSR disabled via `dynamic` import)
- **z-index**: `50` (above content, below modals)
- **Interaction**: `pointer-events-none` (does not interfere with UI)

### Configuration

Default settings in `apps/bff/src/adapters/mock/mock-marketing-directives.ts`:

```typescript
{
  blockType: "winter-effects",
  fields: {
    snowflakeCount: 150,
    speed: [0.5, 3.0],
    wind: [-0.5, 2.0],
    radius: [0.5, 3.0],
  }
}
```

Adjust these values in the campaign directive to customize the effect.

## Files Modified

1. `libs/shared-types/src/cms.types.ts` - Added `WinterEffectsBlock` type
2. `apps/bff/src/ports/cms.port.ts` - Added `CmsRawWinterEffects` type
3. `apps/bff/src/modules/page-data/block-resolvers.ts` - Added winter-effects resolver
4. `apps/bff/src/modules/experience/block-overlay.service.ts` - **Enhanced to inject new blocks**
5. `apps/storefront/components/cms/blocks/winter-effects.tsx` - New component
6. `apps/storefront/components/cms/blocks/index.ts` - Registered new block
7. `apps/bff/src/adapters/mock/mock-marketing-directives.ts` - Added block to winter campaign
8. `apps/storefront/package.json` - Added `react-snowfall` dependency

## Key Architecture Change

The `BlockOverlayService` was enhanced to not only **modify existing blocks** but also **inject new blocks** that don't exist in the base CMS data. This allows campaign-specific blocks (like visual effects) to be added purely through marketing directives without touching the base CMS configuration.

## Accessibility

- Effect is marked `aria-hidden="true"` to prevent screen reader announcement
- No keyboard interaction required or supported
- Does not interfere with page navigation or interactions
