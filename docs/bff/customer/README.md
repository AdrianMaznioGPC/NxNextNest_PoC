# BFF Customer Domain

## Purpose

Manages customer-owned data, currently focused on **address book management**. Saved addresses are used by the checkout flow — especially the express checkout variant, which pre-fills shipping/billing from saved data.

## Key Files

| File                         | Role                               |
| ---------------------------- | ---------------------------------- |
| `address-book.controller.ts` | CRUD endpoints for saved addresses |

## How It Works

The `CheckoutConfig` returned during checkout bootstrap includes a `savedAddresses[]` array. When the experience profile selects the `express` checkout variant, the checkout assembler uses these saved addresses to enable one-click-style ordering.

## Interactions

- **Checkout Domain**: `CheckoutConfig.savedAddresses` is populated from this domain
- **Experience Domain**: Customer profile signals (e.g., `customerProfile=returning`) can influence whether express checkout is offered
