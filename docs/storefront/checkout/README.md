# Storefront Checkout Domain

## Purpose

Owns the checkout UI flows and keeps the checkout main form and order summary in sync. Checkout is **bootstrap-driven** — the BFF returns three checkout slots, and the storefront renders them through the standard slot pipeline.

## Key Files

| File                      | Role                                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `checkout-slot-state.tsx` | Shared state between `page.checkout-main` and `page.checkout-summary` slots (selected addresses, delivery/payment, form progress) |
| `order-summary.tsx`       | Order summary component that reads shared state                                                                                   |
| `flows/single-page/*`     | Single-page checkout flow (all sections visible)                                                                                  |
| `flows/multi-step/*`      | Multi-step wizard flow                                                                                                            |
| `flows/express/*`         | Express flow for returning customers                                                                                              |
| `sections/*`              | Reusable checkout sections (shipping, billing, delivery, payment, review)                                                         |
| `address/*`               | Address form components driven by `AddressFormSchema` from `CheckoutConfig`                                                       |

## Route Structure

- `app/checkout/page.tsx` — Entry point: checks for existing cart, fetches bootstrap, renders slots
- `app/checkout/layout.tsx` — Checkout-specific layout with merged messages
- `app/checkout/confirmation/page.tsx` — Order confirmation page

## How Checkout Flow Selection Works

1. BFF experience profile sets `page.checkout-main` variant key (`single-page`, `multi-step`, or `express`)
2. Storefront `slot-renderer-registry.ts` maps the variant to the corresponding flow component
3. The `CheckoutConfig` from BFF provides `addressSchema`, `deliveryOptions`, `paymentOptions`, and `savedAddresses`
4. `checkout-slot-state.tsx` synchronizes state between the main form and the order summary sidebar

## Interactions

- **BFF Checkout Domain**: Provides `CheckoutConfig` via bootstrap and accepts `PlaceOrderRequest`
- **Cart Domain**: Cart must exist for checkout to render (redirects to home otherwise)
- **Experience Domain**: Determines which checkout flow variant is used
- **Page Renderer**: Checkout slots go through the same `SlotBoundary` → `loadSlotRenderer` pipeline as all other slots
