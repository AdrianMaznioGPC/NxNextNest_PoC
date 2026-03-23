# Storefront Layout Domain

## Purpose

Owns global page chrome: navbar, footer, breadcrumbs, search UI, region switching, and structural layout primitives.

## Key Files

- `apps/storefront/components/layout/footer.tsx`
- `apps/storefront/components/layout/navbar/*`
- `apps/storefront/components/layout/breadcrumbs.tsx`
- `apps/storefront/components/layout/container.tsx`
- `apps/storefront/components/layout/search/*`

## Inputs And Outputs

- Inputs: layout data, domain config, cart UX state, locale/store context
- Outputs: shared navigation and footer UI

## Notes

- Root layout always renders this domain around page content.
