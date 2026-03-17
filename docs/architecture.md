# Architecture Overview

## What This Project Is

A multi-store e-commerce platform built as an Nx monorepo with two applications and three shared libraries. The system follows a **Backend-for-Frontend (BFF)** pattern where a NestJS server aggregates, enriches, and shapes data for a Next.js storefront.

## Monorepo Structure

```
commerce-monorepo/
├── apps/
│   ├── bff/              # NestJS Backend-for-Frontend
│   └── storefront/       # Next.js 15 frontend
├── libs/
│   ├── shared-types/     # TypeScript types shared across apps
│   ├── store-config/     # Multi-store configuration (locales, currencies, domains)
│   └── ui/               # Shared UI component library (design tokens, primitives)
├── k6/                   # Load testing scenarios
├── docs/                 # Documentation
├── Caddyfile             # Local reverse proxy for multi-domain dev
├── nx.json               # Nx workspace configuration
└── tsconfig.base.json    # Shared TypeScript config
```

## How the Apps Integrate

```
Browser ──→ Caddy (domain routing) ──→ Next.js Storefront (:3000)
                                              │
                                         fetch() calls
                                              │
                                              ▼
                                       NestJS BFF (:4000)
                                              │
                                    ┌─────────┼─────────┐
                                    ▼         ▼         ▼
                              Product    Pricing   Availability
                              Port       Port      Port
                              (mock)     (mock)    (mock)
```

1. **Browser** hits a store domain (e.g., `winparts.fr.localhost`).
2. **Caddy** reverse-proxies to the Next.js storefront on port 3000.
3. **Next.js middleware** resolves the store from the hostname and sets an `x-store-code` header.
4. **Server Components** call the BFF via `fetch()` with the store code header.
5. **BFF** aggregates data from multiple ports, enriches products with pricing and availability, and returns a single shaped response per page.
6. **Storefront** renders the response. No business logic lives in the frontend.

## Key Architectural Decisions

### Why a BFF?

- **Single request per page** — The storefront makes one call to get everything a page needs (product + pricing + availability + breadcrumbs + recommendations). Without the BFF, the frontend would need 3-5 parallel fetches per page.
- **Backend owns business logic** — Enrichment (merging pricing into products), purchasability checks, breadcrumb resolution, and canonical slug generation all live server-side.
- **Frontend stays thin** — The storefront is purely a rendering layer. It receives display-ready data and never transforms or combines domain data.
- **Resilience boundary** — Timeouts, retries, circuit breakers, and fallbacks are applied at the BFF layer, invisible to the frontend.
- **Multi-store isolation** — Store-specific data resolution happens in the BFF via the `x-store-code` header. The frontend doesn't know how stores are configured.

### Why Hexagonal Architecture in the BFF?

The BFF uses **ports and adapters** (hexagonal architecture):

- **Ports** define interfaces for external capabilities (product catalog, pricing, availability, CMS, etc.).
- **Adapters** implement those interfaces (currently mock adapters; real adapters plug in later).
- **Domain services** contain business logic and depend only on port interfaces, never on adapters.

This means swapping from mock data to a real Elasticsearch/Commercetools/Contentful backend requires only writing new adapter classes — zero changes to domain services or controllers.

### Why `PageDataController` Instead of Per-Resource Controllers?

The storefront needs **page-shaped** responses, not resource-shaped ones. A product page needs the product, its pricing, availability, breadcrumbs, and recommendations in a single response. A category page needs the collection, its products (pre-enriched), sort options, and pagination.

`PageDataController` is the single entry point that returns exactly what each page needs. The standalone per-resource controllers (`ProductController`, `CollectionController`, etc.) were removed because they were never registered in the NestJS module and had no consumers.

### Why Search and Collection Own Their Own Sort Definitions?

Search results and collection product listings are separate domains. Search may offer "Trending" as a sort option while collections don't. Each domain independently decides its sort behavior. The sort definitions are intentionally duplicated, not shared.

## Shared Libraries

### `@commerce/shared-types`

Pure TypeScript type definitions. No runtime code. Defines the contract between BFF and storefront: `Product`, `Cart`, `Collection`, `CmsBlock`, `CheckoutConfig`, page data contracts, etc.

### `@commerce/store-config`

Store configuration with locale, currency, domain, and language per store. Exports a `resolveStoreFromHostname()` function used by both the Next.js middleware and the BFF's store interceptor.

### `@commerce/ui`

Shared UI component library providing framework-agnostic, accessible primitives styled with Tailwind CSS v4 and design tokens. Components use CVA for variant-driven APIs and Base UI for accessible behavior. The entire visual identity can be swapped by overriding CSS custom properties — no component code changes required. See [docs/ui-library.md](ui-library.md) for full documentation.

## Running Locally

```bash
# Install dependencies
npm install

# Start both apps
npm run dev

# Or start individually
npm run dev:bff        # http://localhost:4000
npm run dev:storefront # http://localhost:3000
```

For multi-domain local development, run Caddy:

```bash
caddy run
```

Then visit `http://winparts.fr.localhost` or `http://winparts.ie.localhost`.
