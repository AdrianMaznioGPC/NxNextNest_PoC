# Listing Container Refactor

**Status**: Phase 2 Complete ✅  
**Date**: January 2025

## What Changed

### Phase 1: Container Extraction ✅

Extracted the repeated pattern of `FilterSidebar + ListingToolbar + ProductListing` into a single reusable `ListingContainer` component.

**Additional improvements bundled with Phase 1:**

- Added breadcrumbs to category list and search results pages
- Standardized heading structure (h1 + description pattern)
- Aligned search summary slot with page heading standards

### Phase 2: Loading States & Skeleton UI ✅

Added comprehensive loading state support with skeleton UI components.

**New components:**

- `ListingContainerSkeleton` - Standalone skeleton component
- `isLoading` prop support in `ListingContainer`
- `loading.tsx` for dynamic pages

**Features:**

- Maintains identical layout structure during loading
- Respects filter/view toggle visibility
- Uses theme tokens (`muted-surface`) for consistency
- Can be used standalone or via `isLoading` prop

## Component Locations

- **Main component**: `apps/storefront/components/layout/listing-container.tsx`
- **Skeleton component**: `apps/storefront/components/layout/listing-container-skeleton.tsx`
- **Loading page**: `apps/storefront/app/[[...page]]/loading.tsx`

## Usage

### Standard Usage

```tsx
import { ListingContainer } from "components/layout/listing-container";

<ListingContainer
  products={products}
  sortOptions={sortOptions}
  filterGroups={filterGroups}
  defaultView="grid"
  showViewToggle={true}
  emptyMessage="No products found"
/>;
```

### With Loading State

```tsx
import { ListingContainer } from "components/layout/listing-container";

<ListingContainer
  products={products}
  sortOptions={sortOptions}
  filterGroups={filterGroups}
  isLoading={isLoading}
/>;
```

### Standalone Skeleton (loading.tsx)

```tsx
import { ListingContainerSkeleton } from "components/layout/listing-container-skeleton";
import Container from "components/layout/container";

export default function Loading() {
  return (
    <Container className="pb-8">
      <ListingContainerSkeleton />
    </Container>
  );
}
```

```

## Props

### ListingContainer Props

| Prop             | Type            | Default               | Description                      |
| ---------------- | --------------- | --------------------- | -------------------------------- |
| `products`       | `Product[]`     | required              | Array of products to display     |
| `sortOptions`    | `SortOption[]`  | required              | Sort options for toolbar         |
| `filterGroups`   | `FilterGroup[]` | optional              | Filter groups for sidebar        |
| `defaultView`    | `ViewMode`      | `"grid"`              | Default view mode (grid/list)    |
| `layoutKey`      | `string`        | optional              | Layout key for toolbar           |
| `showViewToggle` | `boolean`       | `true`                | Show view toggle button          |
| `emptyMessage`   | `string`        | `"No products found"` | Message when no products         |
| `isLoading`      | `boolean`       | `false`               | Show skeleton UI during loading  |

### ListingContainerSkeleton Props

| Prop             | Type      | Default | Description                       |
| ---------------- | --------- | ------- | --------------------------------- |
| `showFilters`    | `boolean` | `true`  | Show filter sidebar skeleton      |
| `showViewToggle` | `boolean` | `true`  | Show view toggle button skeleton  |

## Files Created/Updated

### Phase 1 Files

**Created:**
- `components/layout/listing-container.tsx`

**Updated Nodes:**
- `components/page-renderer/nodes/category-products-node.tsx`
- `components/page-renderer/nodes/search-results-node.tsx`

**Updated Slots:**
- `components/page-renderer/slots/search-products-slot.tsx`
- `components/page-renderer/slots/category-products/clp-list-v1/server.tsx`
- `components/page-renderer/slots/category-products/clp-clearance-v1/server.tsx`
- `components/page-renderer/slots/search-products/search-list-v1/server.tsx`
- `components/page-renderer/slots/search-products/search-clearance-v1/server.tsx`

### Phase 2 Files

**Created:**
- `components/layout/listing-container-skeleton.tsx`
- `app/[[...page]]/loading.tsx`

**Updated:**
- `components/layout/listing-container.tsx` (added `isLoading` prop)

## Benefits

### Phase 1 Benefits
1. **DRY Principle**: Eliminates code duplication across 7+ files
2. **Consistency**: Ensures uniform layout structure across all listing pages
3. **Maintainability**: Single source of truth for listing page layout
4. **Flexibility**: Easy to customize via props without touching internal structure

### Phase 2 Benefits
1. **Better UX**: Users see meaningful loading states instead of blank screens
2. **Layout Stability**: Skeleton maintains exact layout structure, preventing layout shifts
3. **Flexibility**: Can use skeleton standalone or via prop
4. **Theme Consistency**: Uses design system tokens for skeleton UI
5. **Performance**: Instant feedback during server-side rendering

## Future Phases

- **Phase 3**: Add pagination/infinite scroll support
- **Phase 4**: Implement client-side filtering optimization
- **Phase 5**: Add accessibility improvements (ARIA labels, keyboard navigation)
- **Phase 6**: Performance optimizations (virtualization for large lists)
```
