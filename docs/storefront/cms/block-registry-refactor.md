# Block Registry Refactor

## What Changed

The CMS block registration system was refactored from **side-effect-based self-registration** to **explicit lazy loading** with a centralized registry.

### Before

Each block component called `registerBlockRenderer()` at module evaluation time:

```typescript
function HeroBanner({ block }: { block: HeroBannerBlock }) {
  // ...
}

registerBlockRenderer("hero-banner", HeroBanner);
export default HeroBanner;
```

All blocks were imported via `blocks/index.ts` which caused module evaluation issues with client components.

### After

Components are **mapped in the registry** and **lazy-loaded on demand**:

```typescript
// block-registry.tsx
const blockComponentPaths: Record<string, () => Promise<any>> = {
  "hero-banner": () => import("./blocks/hero-banner"),
  "winter-effects": () => import("./blocks/winter-effects"),
  // ...
};
```

Components are now pure exports with no registration logic:

```typescript
export default function HeroBanner({ block }: { block: HeroBannerBlock }) {
  // ...
}
```

## Why This Matters

### Problem Solved

The original system failed when adding **client components** (like `winter-effects` with `"use client"` directive). Next.js creates separate bundles for client/server components, breaking the side-effect-based registration timing.

### Benefits

✅ **Works with client & server components** - No bundle evaluation issues  
✅ **Automatic code splitting** - Each block is its own chunk  
✅ **Scales easily** - Add one line to registry map for new blocks  
✅ **Type-safe** - TypeScript validates all block types  
✅ **Explicit & predictable** - No hidden side effects

## How to Add a New Block

1. Create the component in `components/cms/blocks/your-block.tsx`
2. Export as default with typed props
3. Add to `blockComponentPaths` in `block-registry.tsx`:

```typescript
const blockComponentPaths: Record<string, () => Promise<any>> = {
  // ...
  "your-block": () => import("./blocks/your-block"),
};
```

4. Add the block type to `libs/shared-types/src/cms.types.ts`
5. Add resolver in `apps/bff/src/modules/page-data/block-resolvers.ts`

That's it!

## Technical Details

- Uses React `lazy()` for dynamic imports
- Components are cached after first load
- `BlockRenderer` wraps each block in `<Suspense>` boundary
- Fallback is `null` (no loading spinner for blocks)
