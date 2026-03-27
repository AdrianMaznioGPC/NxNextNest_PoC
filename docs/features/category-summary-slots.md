# Category Summary Slots (CLP + PLP)

## What changed

Category List (CLP) and Category Detail (PLP) pages are now split into two slots:

1. `page.category-summary` (breadcrumbs/title/description)
2. The listing slot (`page.category-list`, `page.category-subcollections`, or `page.category-products`)

This mirrors the search page’s summary + listing structure so headers can be composed, cached, and varied independently from listings.

## How to activate

No activation is required. The BFF assemblers always emit the summary slot first, followed by the listing slot.

To customize variants, use the experience/merchandising profiles for `page.category-products` (listing variants) and add slot rules for `page.category-summary` as needed.
