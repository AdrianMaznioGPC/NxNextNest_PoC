# Storefront Checkout Domain

## Purpose
Owns the checkout UI flows and summary state in the storefront. It renders the slot-based checkout experience returned by the BFF.

## Key Files
- `apps/storefront/components/checkout/checkout-slot-state.tsx`
- `apps/storefront/components/checkout/order-summary.tsx`
- `apps/storefront/components/checkout/flows/single-page/*`
- `apps/storefront/components/checkout/flows/multi-step/*`
- `apps/storefront/components/checkout/flows/express/*`
- `apps/storefront/components/checkout/sections/*`
- `apps/storefront/components/checkout/address/*`

## Inputs And Outputs
- Inputs: `CheckoutConfig`, `Cart`, and checkout slot variant selection
- Outputs: rendered checkout flows and order placement actions

## Notes
- `page.checkout-main` chooses which flow renders.
- `page.checkout-summary` reads shared checkout slot state to stay synchronized.