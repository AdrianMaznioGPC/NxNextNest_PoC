# Storefront Cart Domain

## Purpose

Owns all client-side cart behavior: state management, optimistic mutations, drawer/page presentation, and BFF cart API communication. This domain is initialized in the root layout and available globally throughout the app.

## Key Files

| File                    | Role                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `cart-context.tsx`      | `CartProvider` — global cart state using React context. Receives a `cartPromise` from the server and provides cart data + mutation functions to all children |
| `cart-ux-context.tsx`   | `CartUxProvider` — provides `cartUxMode` (`drawer`/`page`), `cartPath`, and `openCartOnAdd` from the BFF store context                                       |
| `use-cart-mutations.ts` | Custom hook exposing `addItem`, `updateItem`, `removeItem` with optimistic updates                                                                           |
| `cart-view.tsx`         | Cart line item rendering shared between drawer and page modes                                                                                                |
| `actions.ts`            | Server actions for cart operations                                                                                                                           |
| `client-api.ts`         | Client-side fetch wrapper for `/api/cart/*` proxy routes                                                                                                     |

## How Cart State Works

1. Root layout passes a `cartPromise` (server-side BFF fetch) to `CartProvider`
2. `CartProvider` resolves the promise and holds the authoritative cart state
3. Mutations use optimistic updates: UI updates immediately, then reconciles with BFF response
4. On failure, state rolls back to the pre-mutation snapshot
5. Mutations are serialized per tab to prevent out-of-order clobbering

## Cart UX Modes

The BFF store context determines which cart UI mode is active:

- **`drawer`**: Navbar cart button opens a slide-out drawer. No cart page link. Adding to cart can auto-open the drawer (`openCartOnAdd: true`).
- **`page`**: Navbar cart is a link to the localized cart page path. Dedicated cart page route is enabled.

## Interactions

- **BFF Cart Domain**: All mutations proxy through storefront `/api/cart/*` routes to BFF `/cart/current*`
- **Checkout**: Cart data is needed to render the checkout page
- **Layout**: Navbar renders cart icon with quantity badge from `CartProvider`
