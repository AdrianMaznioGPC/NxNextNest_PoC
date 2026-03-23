# BFF Merchandising Domain

## Purpose

Resolves commercial presentation rules such as default sorting, merchandising mode, and listing/page variants driven by store strategy.

## Key Files

- `apps/bff/src/modules/merchandising/merchandising-profile.catalog.ts`
- `apps/bff/src/modules/merchandising/merchandising-resolver.service.ts`
- `apps/bff/src/modules/merchandising/merchandising-validator.service.ts`
- `apps/bff/src/modules/merchandising/merchandising-profile.types.ts`
- `apps/bff/src/modules/merchandising/merchandising.module.ts`

## Inputs And Outputs

- Inputs: store key, route kind, language
- Outputs: merchandising mode, profile id, slot overrides, default sort rules

## Notes

- Product listing and search slot variants are the main consumers today.
