# Heading Alignment and Breadcrumbs - CLP, PLP, SRP

## Summary

Aligned heading sizes across Category List Page (CLP), Product List Page (PLP), and Search Results Page (SRP) to prevent layout shift when navigating between pages. Added breadcrumbs to the root CLP and SRP pages.

## Changes Made

### 1. Type System Updates

**`libs/shared-types/src/page-resolved.types.ts`**

- Added `breadcrumbs: Breadcrumb[]` to `category-list` node type
- Added `breadcrumbs: Breadcrumb[]` to `search-results` node type
- Added `title: string` to `search-results` node type

### 2. BFF Updates

**`apps/bff/src/modules/page-data/assemblers/category-list-page.assembler.ts`**

- Injected `SlugService` to get localized routes
- Built breadcrumbs array: `Home -> All Categories`
- Used `slug.getStaticRoutes()` for proper i18n path localization
- Added breadcrumbs to content node

**`apps/bff/src/modules/page-data/assemblers/search-page.assembler.ts`**

- Injected `SlugService` to get localized routes
- Built breadcrumbs array: `Home -> Search`
- Used `slug.getStaticRoutes()` for proper i18n path localization
- Added `title` field to search results content node
- Added breadcrumbs to content node
- Title uses existing `page.searchTitle` translation

### 3. Storefront Component Updates

**`apps/storefront/components/page-renderer/nodes/category-list-node.tsx`**

- Added `<Breadcrumbs />` component
- Wrapped heading in `<div className="mb-6">` for consistent spacing
- Changed heading from `mb-8` to match PLP structure

**`apps/storefront/components/page-renderer/nodes/search-results-node.tsx`**

- Added `<Breadcrumbs />` component
- Added `<h1>` heading with `text-3xl font-bold text-black`
- Wrapped heading + summary in `<div className="mb-6">`
- Changed summary text color to `text-neutral-500` for visual hierarchy

**`apps/storefront/components/page-renderer/slots/search-summary-slot.tsx`**

- Added `<Breadcrumbs />` component
- Updated heading to `text-3xl font-bold text-black` (was `text-2xl font-semibold`)
- Wrapped heading + summary in `<div className="mb-6">`
- Changed summary text color to `text-neutral-500`

**`apps/storefront/components/page-renderer/slot-types.ts`**

- Added `breadcrumbs` and `title` to `page.search-summary` slot props

**`apps/bff/src/modules/page-data/slot-planner.service.ts`**

- Updated `planSearch()` to pass `breadcrumbs` and `title` to `search-summary` slot inline props

## Result

All three page types now have:

- **Consistent heading**: `text-3xl font-bold text-black`
- **Consistent wrapper**: `<div className="mb-6">` containing title + optional description
- **CLP breadcrumbs**: Shows "Home → All Categories" (properly localized)
- **SRP breadcrumbs**: Shows "Home → Search" (properly localized)
- **No layout shift**: Headings occupy same vertical space across pages

## Note on Search Page Architecture

The search page uses a **split slot architecture** for performance:

- **`page.search-summary`** slot (critical, inline): Contains breadcrumbs, title, and summary - renders immediately
- **`page.search-products`** slot (deferred, reference): Contains product listing - can be streamed

Breadcrumbs and heading were added to the `search-summary` slot, not just the `search-results` node type, to ensure they appear in the actual rendered search page.

## Page Structure Comparison

### Before

```
CLP: [no breadcrumbs] → H1 (mb-8)
PLP: Breadcrumbs → H1 + Description (mb-6)
SRP: [no breadcrumbs] → H1 (text-2xl) + Summary → Products
```

### After

```
CLP: Breadcrumbs → H1 (mb-6)
PLP: Breadcrumbs → H1 + Description (mb-6)
SRP: Breadcrumbs → H1 (text-3xl) + Summary (mb-6) → Products
```
