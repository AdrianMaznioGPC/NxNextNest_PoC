# BFF Product Domain

## Purpose

Exposes product detail and product listing data from the BFF.

## Key Files

- `apps/bff/src/modules/product/product.controller.ts`

## Inputs And Outputs

- Inputs: product handles, locale context
- Outputs: normalized product payloads and recommendations

## Notes

- Product detail assemblers and slot payload resolvers depend on this data.
