# Phase 3 Fix: View Toggle & Filters

## Issue Reported

After Phase 3 implementation, filters and view toggle were not visible on:

- Product Listing Pages (PLPs)
- Search results pages

## Root Cause

**Not a logic error** - the implementation was correct, but:

1. **SearchResultsNode missing prop**: Component wasn't passing `filterGroups` to FilterSidebar
2. **Build cache**: Changes needed rebuild to take effect

## Fixes Applied

### 1. SearchResultsNode Fix

**File**: `apps/storefront/components/page-renderer/nodes/search-results-node.tsx`

```diff
- <FilterSidebar />
+ <FilterSidebar filterGroups={node.filterGroups} />
```

### 2. Search Page Assembler

**File**: `apps/bff/src/modules/page-data/assemblers/search-page.assembler.ts`

Added filter generation to search results:

```typescript
content: [
  {
    type: "search-results",
    query: payload.query,
    summaryText: buildSearchSummary(...),
    products: payload.products,
    sortOptions,
    filterGroups: buildFilterGroups(
      payload.products,
      ctx.localeContext.locale,
      this.i18n,
    ),
  },
],
```

### 3. Full Rebuild

```bash
npm run build
```

## Verification

After fixes, the following should now work:

### Product Listing Pages

Visit: `http://winparts.ie.localhost:3000/categories/brakes/pads`

**Expected:**

- Left sidebar with filters (Availability, Price Range)
- Top toolbar with sort dropdown + view toggle (grid/list icons)
- Products in grid view by default
- Click list icon → products switch to list view
- Check availability filter → URL updates to `?availability=true`
- Select price range → URL updates to `?price=50-100`

### Search Results

Visit: `http://winparts.ie.localhost:3000/search?q=brake`

**Expected:**

- Same layout as PLPs
- Filters generated from search results
- View toggle works
- URL state management works

## Implementation Status

| Phase   | Status      | Description                                  |
| ------- | ----------- | -------------------------------------------- |
| Phase 1 | ✅ Complete | ViewToggle component                         |
| Phase 2 | ✅ Complete | FilterSidebar component                      |
| Phase 3 | ✅ Complete | Category PLP integration                     |
| Phase 4 | ✅ Complete | Search page integration                      |
| Phase 5 | 📋 Future   | Actual filter processing (currently UI only) |

## Files Modified (Phase 3 Fix)

1. `apps/storefront/components/page-renderer/nodes/search-results-node.tsx`
2. `apps/bff/src/modules/page-data/assemblers/search-page.assembler.ts`
3. `docs/features/view-toggle-filters.md` (updated documentation)

## Technical Details

### Filter Visibility Logic

FilterSidebar component includes this check:

```typescript
if (!filterGroups.length) {
  return null; // Hide sidebar when no filters
}
```

This means:

- If BFF doesn't send `filterGroups`, sidebar is hidden
- If `filterGroups` is empty array, sidebar is hidden
- Only shows when actual filter options exist

### Category Page Logic

The CategoryDetailPageAssembler correctly handles two cases:

```typescript
const content =
  payload.subcollections && payload.subcollections.length > 0
    ? [{ type: "category-subcollections", ... }]  // NO filters (navigation)
    : [{
        type: "category-products",
        filterGroups: buildFilterGroups(...),  // YES filters (PLP)
      }];
```

- **Category with subcollections** (`/categories/brakes`) → No filters
- **Category with products** (`/categories/brakes/pads`) → Has filters

## Next Steps

Phase 5 will implement:

- Actual filter processing in BFF collection/search adapters
- More filter types (brand, category, attributes)
- Performance optimizations for large product sets
