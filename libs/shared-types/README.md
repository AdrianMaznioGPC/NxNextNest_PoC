# Shared Types Domain

## Purpose
This library is the contract surface between the BFF and the storefront. It defines the shared commerce models, page bootstrap schema, slot schema, checkout contracts, and renderer key registry.

## Key Files
- `src/index.ts`: central type exports for carts, products, collections, pages, slots, checkout, i18n, and page bootstrap.

## Inputs And Outputs
- Inputs: domain modeling decisions from both apps.
- Outputs: shared TypeScript contracts used by the BFF and storefront.

## How It Fits
- BFF emits these shapes.
- Storefront renders against these shapes.
- The slot-based experience layer depends on this package staying authoritative.