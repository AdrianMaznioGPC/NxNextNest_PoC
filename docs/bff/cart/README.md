# BFF Cart Domain

## Purpose

Owns the entire cart session lifecycle in the BFF. The BFF is the **authoritative owner** of the `cartId` cookie — the storefront never creates or modifies it directly. All cart mutations flow through this module, and the cookie is set/rotated/cleared via `Set-Cookie` headers in BFF responses.

## Key Files

| File                    | Role                                                                   |
| ----------------------- | ---------------------------------------------------------------------- |
| `cart.controller.ts`    | HTTP endpoints for cart CRUD and line item operations                  |
| `cart-cookie.config.ts` | Cookie configuration (name, max-age, path, sameSite, httpOnly, secure) |

## Endpoints

### Cookie-based v2 (current)

| Method   | Path                  | Purpose                     |
| -------- | --------------------- | --------------------------- |
| `POST`   | `/cart/current`       | Create a new cart           |
| `GET`    | `/cart/current`       | Get the current cart        |
| `DELETE` | `/cart/current`       | Clear the cart              |
| `POST`   | `/cart/current/lines` | Add line items              |
| `PATCH`  | `/cart/current/lines` | Update line item quantities |
| `DELETE` | `/cart/current/lines` | Remove line items           |

Legacy ID-based v1 endpoints are still present for migration compatibility.

## How It Works

1. Storefront sends cart requests to its own `/api/cart/*` API routes
2. Those routes proxy to BFF `/cart/current*` endpoints, forwarding cookies
3. BFF reads the `cartId` cookie, performs the operation via the `CartPort` adapter
4. BFF returns the updated `Cart` payload and may set a new `Set-Cookie` header
5. Storefront proxies the `Set-Cookie` header back to the browser

## Cart UX Modes

The BFF domain config controls how cart UI behaves per store:

- **`drawer`** mode: Cart button opens a slide-out drawer. No `/cart` page route exists (BFF returns 404 for it).
- **`page`** mode: Cart link navigates to a dedicated cart page at the localized cart path.

## Cookie Configuration (env vars)

| Variable                      | Default              | Purpose         |
| ----------------------------- | -------------------- | --------------- |
| `CART_COOKIE_NAME`            | `cartId`             | Cookie name     |
| `CART_COOKIE_MAX_AGE_SECONDS` | `2592000` (30 days)  | Cookie lifetime |
| `CART_COOKIE_PATH`            | `/`                  | Cookie path     |
| `CART_COOKIE_SAME_SITE`       | `Lax`                | SameSite policy |
| `CART_COOKIE_HTTP_ONLY`       | `true`               | HttpOnly flag   |
| `CART_COOKIE_SECURE`          | `true` in production | Secure flag     |

## Interactions

- **Checkout**: The checkout assembler reads the same `cartId` cookie to load cart data for the checkout page
- **Storefront CartProvider**: Manages optimistic UI state, serializes mutations per tab, rolls back on failure
