# BFF Checkout Domain

## Purpose

Exposes checkout configuration and order placement endpoints. Checkout is now **bootstrap-driven** like every other page — the BFF assembles slot manifests for the checkout page, and the storefront renders them through the same slot renderer pipeline.

## Key Files

| File                     | Role                                                   |
| ------------------------ | ------------------------------------------------------ |
| `checkout.controller.ts` | HTTP endpoints for checkout config and order placement |
| `checkout.dto.ts`        | Request/response DTOs                                  |

## How Checkout Works

Checkout participates in the standard bootstrap pipeline:

1. Storefront `/checkout` route calls `getRequestBootstrap()`
2. BFF recognizes route kind `checkout`
3. `CheckoutPageAssembler` reads the `cartId` cookie, loads the cart, and fetches `CheckoutConfig` (address schemas, delivery/payment options, saved addresses)
4. If no cart exists, bootstrap returns 404
5. Slot planner creates three slots: `page.checkout-header`, `page.checkout-main`, `page.checkout-summary`
6. Experience can set the `page.checkout-main` variant to `single-page`, `multi-step`, or `express`

## Checkout Flow Types

| Variant Key             | Flow                                                     |
| ----------------------- | -------------------------------------------------------- |
| `single-page` (default) | All sections visible on one page                         |
| `multi-step`            | Step-by-step wizard (shipping → payment → review)        |
| `express`               | Streamlined flow for returning customers with saved data |

The flow type is driven by the `page.checkout-main` slot `variantKey`, which is set by the experience profile (e.g., a returning customer with saved addresses may get `express`).

## Endpoints

| Method | Path                   | Purpose                |
| ------ | ---------------------- | ---------------------- |
| `POST` | `/checkout/orders`     | Place an order         |
| `GET`  | `/checkout/orders/:id` | Get order confirmation |

## Interactions

- **Cart Domain**: Checkout depends on the same `cartId` cookie to load cart state
- **Experience Domain**: Determines which checkout flow variant is used
- **Customer Domain**: Provides saved addresses for express checkout
- **Storefront**: Renders the three checkout slots and synchronizes main/summary state via `checkout-slot-state.tsx`
