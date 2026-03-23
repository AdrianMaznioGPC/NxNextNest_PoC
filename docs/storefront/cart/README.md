# Storefront Cart Domain

## Purpose

Owns cart UI, client-side cart state, mutation hooks, and cart presentation in the storefront.

## Key Files

- `apps/storefront/components/cart/cart-context.tsx`
- `apps/storefront/components/cart/cart-ux-context.tsx`
- `apps/storefront/components/cart/use-cart-mutations.ts`
- `apps/storefront/components/cart/cart-view.tsx`
- `apps/storefront/components/cart/actions.ts`
- `apps/storefront/components/cart/client-api.ts`

## Inputs And Outputs

- Inputs: cart bootstrap data, cart mutation intents, store cart UX config
- Outputs: cart UI state and BFF/cart requests

## Notes

- Used globally from the root layout.
