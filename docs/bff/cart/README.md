# BFF Cart Domain

## Purpose

Owns cart session handling in the BFF. It exposes the current cart over HTTP and resolves the cart cookie used to identify the shopper session.

## Key Files

- `apps/bff/src/modules/cart/cart.controller.ts`
- `apps/bff/src/modules/cart/cart-cookie.config.ts`

## Inputs And Outputs

- Inputs: request cookies, locale context, cart mutation requests
- Outputs: normalized `Cart` payloads from the backend adapter layer

## Notes

- Storefront cart UI calls this domain directly.
- Checkout bootstrap depends on the same cart cookie to render `/checkout`.
