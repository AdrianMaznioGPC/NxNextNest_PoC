# BFF Collection Domain

## Purpose
Exposes collection and category data from the BFF. It backs category list and category detail pages.

## Key Files
- `apps/bff/src/modules/collection/collection.controller.ts`

## Inputs And Outputs
- Inputs: localized collection handles or paths
- Outputs: normalized collection page data and collection records

## Notes
- `page-data` assemblers use collection data to build category pages.