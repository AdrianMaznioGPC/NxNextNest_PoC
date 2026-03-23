# BFF Slug Domain

## Purpose

Owns localized path generation and normalization. It turns canonical entity identifiers into locale-aware storefront URLs.

## Key Files

- `apps/bff/src/modules/slug/slug.service.ts`
- `apps/bff/src/modules/slug/slug-mapper.service.ts`
- `apps/bff/src/modules/slug/link-localization-policy.service.ts`
- `apps/bff/src/modules/slug/slug.types.ts`
- `apps/bff/src/modules/slug/slug.module.ts`

## Inputs And Outputs

- Inputs: locale context plus canonical handles or route kinds
- Outputs: localized internal paths and localization audits

## Notes

- Route recognition and page assembly depend on consistent slug logic.
