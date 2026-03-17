# CMS Block System

## Overview

The CMS block system enables server-driven page composition. The CMS stores "raw" block data (product handles, collection IDs, text content). The BFF resolves these into display-ready blocks. The storefront renders them via a component registry.

## Data Flow

```
CMS (raw blocks)
     │
     ▼
BFF: CmsPort.getPage("home")
     │
     ▼ CmsRawBlock[]
     │
BFF: resolveBlocks() — calls registered resolvers
     │
     ▼ CmsBlock[] (display-ready)
     │
Storefront: BlockRenderer
     │
     ▼ Looks up component per block.type
     │
React component renders
```

## BFF Side

### Raw Types (`ports/cms.types.ts`)

Raw blocks contain references, not resolved data:

- `CmsRawFeaturedProducts` has `productHandles: string[]` (not full products).
- `CmsRawProductCarousel` has `collectionHandle: string` (not products).
- `CmsRawFeaturedCategory` has `collectionHandles: string[]`.
- `CmsRawHomepageHero` has no `megaMenu` — it's injected during resolution.

### Block Resolver Registry (`block-resolver-registry.ts`)

A map from block type to resolver function. Resolvers are async and receive a `BlockResolverContext` with access to domain services and ports:

```typescript
type BlockResolverContext = {
  productDomain: ProductDomainService;
  catalogDomain: CatalogDomainService;
  collections: CollectionPort;
  navigation: NavigationPort;
};
```

### Resolvers (`blocks/*.block.ts`)

| Block Type | What the Resolver Does |
|-----------|----------------------|
| `hero-banner` | Pass-through (no resolution needed) |
| `homepage-hero` | Fetches mega menu from `NavigationPort`, merges with banner data |
| `featured-products` | Resolves product handles via `ProductDomainService.getProductsByHandles()` (enriched with pricing/availability) |
| `product-carousel` | Fetches collection products via `CollectionPort.getCollectionProducts()` (pre-enriched from index) |
| `rich-text` | Pass-through |
| `cms-banner` | Pass-through |
| `banner-grid` | Pass-through |
| `featured-category` | Fetches all collections, filters by handles |
| `social-proof` | Pass-through |

### Registration

`registerAllBlockResolvers()` in `blocks/index.ts` registers all resolvers at module load. Called from `ContentDomainService` at import time.

## Storefront Side

### Block Registry (`components/cms/block-registry.tsx`)

Same pattern as the BFF — a map from block type to React component. `registerBlockRenderer()` registers a component. `getBlockRenderer()` looks it up.

### BlockRenderer (`components/cms/block-renderer.tsx`)

Iterates the `CmsBlock[]` from the BFF response, looks up the component for each block type, and renders it. Warns to console if no renderer is found.

### Adding a New Block Type

1. **Shared types** (`libs/shared-types/src/index.ts`):
   - Define the display-ready block type (e.g., `VideoBlock`).
   - Add it to the `CmsBlock` union.

2. **BFF raw types** (`apps/bff/src/ports/cms.types.ts`):
   - Define the raw block type (e.g., `CmsRawVideo`).
   - Add it to the `CmsRawBlock` union.

3. **BFF resolver** (`apps/bff/src/modules/page-data/blocks/`):
   - Create a resolver file (e.g., `video.block.ts`).
   - Register it in `blocks/index.ts`.

4. **Mock data** — Add the block to the CMS page data in `mock-cms.adapter.ts`.

5. **Storefront component** (`apps/storefront/components/cms/blocks/`):
   - Create a React component.
   - Register it in `blocks/index.ts`.
