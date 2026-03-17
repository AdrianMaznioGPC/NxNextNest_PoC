# BFF (Backend-for-Frontend)

## Overview

The BFF is a NestJS application using Fastify that sits between the Next.js storefront and backend services. It aggregates data from multiple ports, enriches products with pricing and availability, applies resilience policies, and returns page-shaped responses.

**Location:** `apps/bff/`

## Hexagonal Architecture

```
Controllers ──→ Domain Services ──→ Ports (interfaces)
                                         │
                                    Adapters (implementations)
                                         │
                                    Mock data / Real backends
```

### Ports (`src/ports/`)

Interfaces that define what the BFF can do. Each port is a Symbol-based injection token and a TypeScript interface:

| Port | Purpose |
|------|---------|
| `ProductPort` | Fetch base product catalog data (no pricing/availability) |
| `PricingPort` | Fetch variant-level pricing |
| `AvailabilityPort` | Fetch variant-level stock status |
| `CollectionPort` | Fetch category trees and collection product listings |
| `CmsPort` | Fetch raw CMS page content (blocks needing resolution) |
| `NavigationPort` | Fetch mega menu and featured links |
| `MenuPort` | Fetch legacy menu structures |
| `PagePort` | Fetch static pages (About, FAQ, etc.) |
| `CartPort` | Cart CRUD operations |
| `CheckoutPort` | Checkout config and redirect URLs |
| `CustomerPort` | Address book CRUD |
| `SearchPort` | Full-text product search with sorting and pagination |
| `OrderPort` | Stub for future order domain |

**Design decision:** Ports return `BaseProduct` (without pricing/availability). The `ProductDomainService` enriches these into display-ready `Product` objects. This separation exists because pricing and availability come from different backends in a real system and may fail independently.

### Adapters (`src/adapters/`)

Two adapter modules exist:

- **`MockBackendModule`** — In-memory mock data for development. Default.
- **`ChaosBackendModule`** — Wraps mock adapters with configurable failure injection for load testing. Activated via `BFF_BACKEND=chaos`.

### Domain Services (`src/modules/`)

| Service | Responsibility |
|---------|---------------|
| `ProductDomainService` | Enriches `BaseProduct` with pricing + availability → `Product`. Handles recommendations, breadcrumbs, sitemap entries, purchasability validation. |
| `CatalogDomainService` | Builds category page data with breadcrumbs. Delegates product listings to `CollectionPort`. |
| `ContentDomainService` | Resolves raw CMS blocks into display-ready blocks (e.g., resolving product handles into enriched products). |
| `NavigationDomainService` | Combines mega menu and featured links into `GlobalLayoutData`. |
| `PageDataService` | Orchestrator that delegates to domain services. Builds sitemap, search results, and page/menu responses. |

### Controllers

| Controller | Routes | Purpose |
|-----------|--------|---------|
| `PageDataController` | `/page-data/*` | All page-shaped data for the storefront |
| `CartController` | `/cart/*` | Cart mutations with purchasability validation |
| `CheckoutController` | `/checkout/*` | Checkout configuration |
| `AddressBookController` | `/customers/me/addresses/*` | Address CRUD (requires authentication) |
| `HealthController` | `/health/*` | Liveness, readiness, and metrics |
| `ChaosController` | `/chaos/*` | Chaos injection control plane (chaos mode only) |

## Product Enrichment

The core enrichment flow (`product-enrichment.ts`):

```
BaseProduct + ProductPricing + ProductAvailability + Breadcrumbs
                        │
                        ▼
                   mapToProduct()
                        │
                        ▼
                    Product (display-ready)
```

When pricing or availability is missing (port failure with fallback, or no data):
- Product is marked `purchasable: false`
- `stockStatus` = `"unavailable"`, `stockMessage` = `"Currently Unavailable"`
- `priceRange` values are `undefined`
- Individual variants inherit the same unavailable status

This is a deliberate graceful degradation — the product still renders but can't be purchased.

## CMS Block Resolution

CMS data arrives as "raw" blocks (e.g., `CmsRawFeaturedProducts` contains product handles, not full products). The block resolver system transforms these into display-ready blocks:

1. `ContentDomainService` fetches the raw CMS page.
2. `resolveBlocks()` iterates raw blocks and calls the registered resolver for each type.
3. Each resolver fetches needed data (products by handle, collections, mega menu) and returns a `CmsBlock`.
4. Results are returned as `HomePageData.blocks`.

Resolvers are registered at module load via `registerAllBlockResolvers()`.

**Block types:** `hero-banner`, `homepage-hero`, `featured-products`, `product-carousel`, `rich-text`, `cms-banner`, `banner-grid`, `featured-category`, `social-proof`.

## Store Context

Multi-store is handled via a request-scoped `StoreContext`:

1. `StoreInterceptor` reads `x-store-code` from request headers.
2. Resolves store config (locale, currency) from `@commerce/store-config`.
3. Attaches context to the request object.
4. `StoreContext` (request-scoped injectable) reads from the request.
5. Mock adapters use `StoreContext` to return store-specific data.

**Customer identification:** The `x-customer-id` header or `customerId` cookie provides the customer ID. `StoreContext.customerId` exposes it. `AddressBookController` uses `requireAuth()` to enforce authentication.

## Validation

Request bodies are validated via `class-validator` DTOs (e.g., `AddToCartDto`, `UpdateCartDto`). A global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` strips unknown fields and rejects invalid payloads.

## Error Handling

The `BffErrorFilter` is a global exception filter that returns structured `BffErrorResponse` objects:

```json
{
  "statusCode": 504,
  "errorCode": "UPSTREAM_TIMEOUT",
  "message": "Timeout exceeded for \"product.getProduct\"",
}
```

Resilience errors map to specific status codes:
- `TimeoutPolicyError` → 504 with `Retry-After: 2`
- `CircuitOpenError` → 503 with `Retry-After: 5`
- `ConcurrencyLimitError` → 503 with `Retry-After: 2`

## Pre-Enriched Product Index

For collection and search listings, products are pre-enriched at module load time (`mock-product-index.ts`). This simulates how a real search backend (Elasticsearch, Algolia) would work — products are indexed with pricing and availability baked in. No runtime calls to pricing/availability ports for listings.

This is separate from `ProductDomainService.enrich()` which does runtime enrichment for individual product pages (where freshness matters more).
