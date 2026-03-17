# Storefront (Next.js)

## Overview

The storefront is a Next.js 15 application using the App Router, React Server Components, and Tailwind CSS v4. It is a **thin rendering layer** — it fetches pre-shaped data from the BFF and renders it. No business logic, data transformation, or domain aggregation happens here.

**Location:** `apps/storefront/`

## Design Principles

1. **No business logic in the frontend.** The storefront never merges pricing into products, resolves breadcrumbs, or validates purchasability. The BFF does all of that.
2. **One BFF call per page.** Each page makes a single `fetch()` to a `/page-data/*` endpoint and receives everything it needs.
3. **Server Components by default.** Data fetching happens in RSCs. Client Components are used only for interactivity (cart, variant selector, checkout form, store switcher).
4. **Types come from shared-types.** `lib/types.ts` re-exports everything from `@commerce/shared-types`. Components import from `lib/types`.

## Key Features

### Multi-Store

- **Middleware** (`middleware.ts`) resolves the store from the `host` header using `resolveStoreFromHostname()` and sets `x-store-code` on the request.
- **API client** (`lib/api/index.ts`) reads the header and forwards it to the BFF on every fetch.
- **Store switcher** (`components/layout/store-switcher.tsx`) is a client component that navigates to the other store's domain.
- **Caddy** (`Caddyfile`) reverse-proxies `winparts.fr.localhost` and `winparts.ie.localhost` to port 3000.

### Internationalization

- **`next-intl`** handles translations. Messages live in `messages/en.json` and `messages/fr.json`.
- **`i18n/request.ts`** resolves the locale from the `x-store-code` header and loads the correct message bundle.
- The locale is derived from the store config, not the URL or browser language.

### Caching

- Server Component data fetches use Next.js `"use cache"` directive with `cacheTag` and `cacheLife`.
- Cache tags: `collections`, `products`, `cart`, `checkout`.
- All page data is cached with `cacheLife("days")` and revalidated via the `/api/revalidate` webhook.
- Cart and checkout data is never cached (fetched fresh every time).

### Revalidation

`app/api/revalidate/route.ts` accepts POST requests with a `secret` query param and a `tag` body field. When called, it revalidates the matching cache tag. This allows the BFF or a CMS webhook to trigger cache invalidation.

## Pages

| Route | BFF Endpoint | Description |
|-------|-------------|-------------|
| `/` | `/page-data/home` | Homepage with CMS blocks |
| `/categories` | `/page-data/categories` | Category list page |
| `/categories/:slug/c/:id` | `/page-data/categories/:id` | Category detail (products or subcategories) |
| `/product/:slug/p/:id` | `/page-data/product/:id` | Product detail page |
| `/search` | `/page-data/search` | Search results with sorting/pagination |
| `/checkout` | `/checkout/config` + `/cart/:id` | Checkout form |
| `/:page` | `/page-data/pages/:handle` | Static CMS pages (About, FAQ, etc.) |

### URL Structure

- **Category URLs:** `/categories/{slug}/c/{categoryId}` — The slug is for SEO/readability, the `categoryId` is the canonical identifier. If the slug doesn't match the canonical slug from the BFF, the page redirects.
- **Product URLs:** `/product/{slug}/p/{productId}` — Same pattern. Slug mismatch triggers a redirect to the canonical URL.

This pattern means URLs are stable even if product/category names change. The ID is the source of truth; the slug is cosmetic.

## CMS Block Rendering

The storefront mirrors the BFF's block resolver pattern:

1. `BlockRenderer` component iterates `CmsBlock[]` from the BFF.
2. `block-registry.tsx` maps block types to React components.
3. `blocks/index.ts` registers all renderers at import time via `registerAllBlockRenderers()`.
4. Each block component receives its typed block data and renders it.

**Block components:** `HomepageHero`, `HeroBanner`, `FeaturedProducts`, `ProductCarousel`, `RichText`, `CmsBanner`, `BannerGrid`, `FeaturedCategory`, `SocialProof`.

## Cart

### State Management

- `CartProvider` wraps the app with a context holding the cart promise.
- `useCart()` hook uses `useOptimistic()` from React 19 for instant UI updates.
- Cart mutations trigger optimistic updates immediately, then fire server actions.

### Server Actions (`components/cart/actions.ts`)

- `addItem` — Adds a variant to the cart. Creates a cart if none exists. Stores `cartId` in a cookie.
- `removeItem` — Removes by merchandise ID.
- `updateItemQuantity` — Updates quantity (0 = remove).
- `redirectToCheckout` — Gets the checkout redirect URL from the BFF.

All actions handle `BffError` and map error codes to translated user-facing messages.

### Error Handling

The `BffError` class wraps the structured error response from the BFF. Server actions catch it and return translated messages based on the error code:

- `CIRCUIT_OPEN`, `CONCURRENCY_LIMIT`, `OVERLOADED` → "Service temporarily unavailable"
- `UPSTREAM_TIMEOUT` → "Request timed out"
- `ITEMS_NOT_PURCHASABLE` → "Item is not available for purchase"

## Checkout

The checkout page (`app/checkout/`) fetches `CheckoutConfig` from the BFF which contains:

- **Address schema** — Field definitions with labels, types, validation rules, and layout (column spans). Fully server-driven.
- **Billing address schema** — Separate schema (omits contact fields).
- **Delivery options** — Store-specific shipping methods with prices.
- **Payment options** — Store-specific payment methods.
- **Saved addresses** — Pre-populated from the customer's address book.

The `CheckoutForm` is a client component that renders the schema-driven form. The `AddressPicker` component shows saved addresses as a horizontally scrollable card list.

## API Client (`lib/api/index.ts`)

All BFF communication goes through `bffFetch()`:

- Adds `x-store-code` and `Content-Type` headers.
- Parses error responses into `BffError` instances.
- Extracts `Retry-After` headers into error details.
- Returns `undefined` for empty response bodies.

Helper functions wrap specific endpoints and handle caching/auth headers.

## Component Organization

```
components/
├── address/         # Address picker for checkout
├── cart/            # Cart modal, add-to-cart, quantity controls, server actions
├── cms/             # CMS block renderer and block components
├── grid/            # Product grid layout
├── icons/           # SVG logo
├── layout/          # Navbar, footer, breadcrumbs, pagination, search, store switcher
├── product/         # Product gallery, description, variant selector
├── label.tsx        # Price label overlay
├── loading-dots.tsx # Loading indicator
├── logo-square.tsx  # Logo component
├── price.tsx        # Currency-formatted price display
├── prose.tsx        # HTML content renderer
└── opengraph-image.tsx
```
