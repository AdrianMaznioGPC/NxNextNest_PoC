# BFF Checkout Domain

## Purpose
Exposes checkout configuration and order placement endpoints. This is the BFF boundary for checkout flow rules and order confirmation interactions.

## Key Files
- `apps/bff/src/modules/checkout/checkout.controller.ts`
- `apps/bff/src/modules/checkout/checkout.dto.ts`

## Inputs And Outputs
- Inputs: locale/store context, cart identity, order payloads
- Outputs: `CheckoutConfig`, `OrderConfirmation`, and checkout write responses

## Notes
- `page-data` uses checkout config when assembling the slot-based checkout page.
- Storefront checkout actions still post to this domain for order creation.