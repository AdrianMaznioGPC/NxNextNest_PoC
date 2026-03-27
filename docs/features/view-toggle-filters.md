# View Toggle & Filters Feature

## Overview

Unified product listing experience with view switching (grid/list) and filtering capabilities for category and search pages.

## Status

**Phases 1-4: COMPLETE** ✅  
**Ready to test in development**

### Active On

- ✅ **Product Listing Pages (PLPs)**: All category pages with products  
  Examples: `/categories/brakes/pads`, `/categories/suspension`
- ✅ **Search Results**: All search queries  
  Examples: `/search?q=brake`, `/search?q=tire`

### Not Active On

- ❌ **Category Navigation Pages**: Pages with only subcategories (no products)  
  Examples: `/categories/brakes` (shows Pads, Rotors subcategories)

### How to Test

1. **Start dev servers**: `npm run dev`
2. **Visit PLP**: http://winparts.ie.localhost:3000/categories/suspension
3. **Expected**:
   - Left sidebar with "Filters" heading
   - Availability filter (In Stock checkbox)
   - Price Range filter with counts
   - Top toolbar with sort dropdown + grid/list icons
   - Products in grid view by default
4. **Test interactions**:
   - Click list icon → products switch to list view
   - Check "In Stock" → URL updates to `?availability=true`
   - Select price range → URL updates with `?price=50-100`
   - Toggle view → URL updates with `?view=list`

## Components

### ViewToggle

- **Location**: `apps/storefront/components/layout/view-toggle.tsx`
- **Function**: Switch between grid and list views
- **URL param**: `?view=grid|list`

### FilterSidebar

- **Location**: `apps/storefront/components/layout/filter-sidebar.tsx`
- **Function**: Filter products by availability, price, etc.
- **URL params**: `?availability=true&price=50-100,100-200`

### ListingToolbar

- **Location**: `apps/storefront/components/layout/listing-toolbar.tsx`
- **Function**: Combined sort + view toggle controls
- **Usage**: Top of product listings

## Implementation Phases

### ✅ Phase 1: View Toggle Component

- Created standalone view toggle with grid/list modes
- URL-based state management
- Integrated with ProductListing component

### ✅ Phase 2: Filter Sidebar Component

- Created filter sidebar with collapsible groups
- Checkbox and toggle filter types
- URL-based filter state with multi-select
- Clear all filters functionality

### ✅ Phase 3: Category Page Integration (COMPLETE)

**Goals:**

1. Add FilterSidebar to category pages
2. Connect filters to BFF filter data
3. Ensure view toggle + filters work together
4. Update category layout with sidebar

**Tasks:**

- [x] Add `filterGroups` to `category-products` and `search-results` types
- [x] Update FilterSidebar to accept filterGroups prop (removed MOCK_FILTERS)
- [x] Update CategoryProductsNode to use FilterSidebar + ListingToolbar layout
- [x] Create `buildFilterGroups()` utility in page-assembler.utils.ts
- [x] Update CategoryDetailPageAssembler to generate filters from products
- [x] Add filter translations (en, es, nl, fr) to mock-data.ts
- [x] Verify builds pass for BFF and storefront

**Implementation:**

- Filter groups are dynamically generated based on products in the category
- Availability filter: Always shows "In Stock" toggle
- Price range filter: Shows 4 ranges ($0-50, $50-100, $100-200, $200+) with product counts
- Filters use URL params for state (e.g., `?availability=true&price=50-100,100-200`)
- Layout: Sidebar (filters) + Main (toolbar + products)

### ✅ Phase 4: Search Page Integration (COMPLETE)

**Goals:**

1. Integrate filters into search results page
2. Add search-specific filter options
3. Ensure filters work with search query

**Tasks:**

- [x] Update SearchPageAssembler to generate filters using buildFilterGroups()
- [x] Fix SearchResultsNode to pass filterGroups prop to FilterSidebar
- [x] Fix deferred slot handler (SlotDataService) to include sortOptions + filterGroups
- [x] Update all search-products slot variants (default, search-list-v1, search-clearance-v1)
- [x] Update all category-products slot variants (default, clp-list-v1, clp-clearance-v1)
- [x] Remove duplicate sort dropdown from search-summary slot
- [x] Verify builds pass
- [x] Test filters with search queries

**Implementation:**

- Search results now use the same filter generation logic as category pages
- Filters are based on the actual search results (availability + price ranges)
- Same UI/UX as category pages for consistency
- **Critical fix**: Updated `SlotDataService.resolveSlotPayload()` for `slot:search-products` to include `sortOptions` and `filterGroups` (deferred slot architecture)
- All slot variants (both search and category) now use unified layout: FilterSidebar + ListingToolbar + ProductListing
- Removed old FilterList component usage, replaced with ListingToolbar
- Search summary slot simplified - only shows heading and query text (no duplicate sort dropdown)

### ✅ Phase 4.1: Slot Variant Updates (COMPLETE)

**Discovered Issue:**

Slot variants were using old UI components instead of the new unified layout.

**Files Updated:**

1. **Search Product Variants:**

   - `search-list-v1/server.tsx` - Already updated ✅
   - `search-clearance-v1/server.tsx` - Already updated ✅

2. **Category Product Variants:**

   - `clp-list-v1/server.tsx` - Updated to use FilterSidebar + ListingToolbar + ProductListing
   - `clp-clearance-v1/server.tsx` - Updated to use FilterSidebar + ListingToolbar + ProductListing (keeps clearance banner)

3. **Search Summary Slot:**
   - `search-summary-slot.tsx` - Removed duplicate sort dropdown (FilterList component)
   - Now only renders search heading and query summary text
   - Sorting handled by ListingToolbar in the products slot below

**Changes Made:**

- Replaced old layout (FilterList dropdown + custom product cards) with new unified layout
- All variants now accept `filterGroups` prop and render FilterSidebar
- All variants use ListingToolbar for sort + view toggle
- All variants use ProductListing component for consistent product rendering
- Default view: list mode for list/clearance variants, grid for default

### 📋 Phase 5: Filter Processing Logic (FUTURE)

**Goals:**

1. Implement actual filtering of products based on URL params
2. Add more filter types (brand, category, custom attributes)
3. Optimize filter generation for large product sets

**Tasks:**

- [ ] Add filter processing to collection adapter
- [ ] Add filter processing to search adapter
- [ ] Support brand/manufacturer filters
- [ ] Support multi-select category filters
- [ ] Add filter result counts based on active filters
- [ ] Optimize filter queries for performance

## URL Parameter Schema

```
# View mode
?view=grid              # Grid view (default)
?view=list              # List view

# Single filter
?availability=true      # In-stock only
?price=50-100          # Single price range

# Multiple filters
?price=50-100,100-200  # Multiple price ranges
?availability=true&price=50-100  # Combined filters

# With view mode
?view=list&availability=true&price=100-200
```

## Testing

### Manual Test Checklist

**Product Listing Pages:**

- [ ] Category PLP shows filters sidebar on left
- [ ] Toolbar shows sort dropdown + view toggle
- [ ] Grid/list toggle switches product layout
- [ ] Availability filter updates URL and works
- [ ] Price range filters show correct counts
- [ ] URL params persist on navigation

**Search Pages:**

- [ ] Search summary shows query text (no duplicate sort dropdown)
- [ ] Filters sidebar appears on left
- [ ] Toolbar shows sort + view toggle
- [ ] Filters work same as category pages
- [ ] All search variants (list, clearance) use same layout

**Slot Variants:**

- [ ] `clp-list-v1` variant renders with filters
- [ ] `clp-clearance-v1` variant renders with filters + banner
- [ ] `search-list-v1` variant renders with filters
- [ ] `search-clearance-v1` variant renders with filters + banner

### Test URLs

```bash
# Product Listing Pages (PLPs)
http://winparts.ie.localhost:3000/categories/brakes/pads
http://winparts.ie.localhost:3000/categories/suspension

# With filters
http://winparts.ie.localhost:3000/categories/brakes/pads?availability=true&price=50-100

# With list view
http://winparts.ie.localhost:3000/categories/suspension?view=list

# Combined filters + view
http://winparts.ie.localhost:3000/categories/suspension?view=list&availability=true&price=50-100,100-200

# Search pages
http://winparts.ie.localhost:3000/search?q=brake
http://winparts.ie.localhost:3000/search?q=brake&view=list&price=0-50
```

## Files Modified

### Phase 4 + 4.1 Changes

**BFF (Backend):**

- `apps/bff/src/modules/page-data/slot-data.service.ts` - Added sortOptions + filterGroups to search-products deferred slot

**Storefront (Frontend):**

- `apps/storefront/components/page-renderer/slots/search-summary-slot.tsx` - Removed duplicate FilterList, simplified layout
- `apps/storefront/components/page-renderer/slots/category-products/clp-list-v1/server.tsx` - Updated to new layout
- `apps/storefront/components/page-renderer/slots/category-products/clp-clearance-v1/server.tsx` - Updated to new layout
- `apps/storefront/components/page-renderer/nodes/category-products-node.tsx` - Removed debug text

## Architecture Notes

### Slot Architecture Patterns

The application uses two different slot planning strategies:

1. **Inline Slots** (Category pages, Content pages)

   - All data assembled in `PageAssembler` → content node
   - `SlotPlannerService` uses `toSlotsFromContent()` for default planning
   - All props (including filterGroups, sortOptions) included in inline slot manifest
   - Data flows: Assembler → Inline Slot → Component

2. **Deferred Slots** (Search products, PDP recommendations, Reviews, FAQ)
   - Data split across multiple slots with different loading strategies
   - Search uses custom planning: `slot:search-summary` (inline) + `slot:search-products` (deferred)
   - Deferred slots resolved later via `SlotDataService.resolveSlotPayload()`
   - **Critical**: Deferred slots must fetch/generate their own data (sortOptions, filterGroups, etc.)
   - Data flows: Assembler → Split (Summary Inline + Products Deferred via SlotDataService) → Components

**This explains why Phase 4 required updating both:**

- `SearchPageAssembler` (for content node - not used directly by deferred slot)
- `SlotDataService` (for actual deferred slot data that gets rendered)

### Page Types

The system distinguishes between three category page types:

1. **Category Navigation** (`/categories/brakes`)

   - Has subcollections
   - Renders: `category-subcollections` node
   - Shows: Grid of subcategory cards
   - **No filters/sorting** (navigation only)

2. **Product Listing Page - Leaf** (`/categories/brakes/pads`)

   - Leaf collection with products
   - Renders: `category-products` node
   - Shows: Products with filters + sorting + view toggle
   - **Has filters** ✅

3. **Product Listing Page - Direct** (`/categories/suspension`)
   - Top-level category without subcollections
   - Renders: `category-products` node
   - Shows: Products with filters + sorting + view toggle
   - **Has filters** ✅

### Filter Generation

- Filters are generated **dynamically** based on actual products in the result set
- **Availability filter**: Always included (In Stock toggle)
- **Price range filter**: Only included if products exist, shows 4 ranges with counts
- Empty price ranges are automatically excluded
- Currency symbols adapt to locale ($ for USD, € for EUR)

### State Management

- All filter state stored in URL query parameters
- Multi-select supported via comma-separated values: `?price=50-100,100-200`
- View mode stored in `?view=grid|list` parameter
- Client-side navigation (no page reload) when toggling filters/view
