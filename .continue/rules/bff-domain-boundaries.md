---
globs: apps/bff/src/**/*.ts
---

The BFF uses hexagonal architecture with strict domain separation. Adapters are pure data access — domain services do all orchestration/enrichment.

## Architecture Layers
1. **Ports** (`ports/`) — interfaces defining what each backend system provides. No cross-domain imports.
2. **Adapters** (`adapters/{backend}/`) — implement ports using a specific backend. Each adapter imports ONLY its own domain's data. No orchestration logic.
3. **Domain Services** (`modules/{domain}/`) — orchestrate across ports, enrich data, compose responses. This is where cross-domain assembly happens.
4. **Controllers** — thin HTTP layer. Always delegate to domain services, never directly to ports.

## Key Types
- `BaseProduct` — what PIM provides (no pricing, no availability, no breadcrumbs)
- `Product` — enriched type the FE receives (BaseProduct + pricing + availability + breadcrumbs)
- `ProductPort` returns `BaseProduct`, NOT `Product`
- `CollectionPort.getCollectionProductIds()` returns `string[]`, NOT products
- `ProductDomainService.enrich()` assembles `BaseProduct` → `Product` using `PricingPort` + `AvailabilityPort`

## Domain → System of Record Mapping
| Domain | Port | Future Backend |
|---|---|---|
| Product Data | ProductPort | PIM |
| Pricing | PricingPort | ERP / SAP |
| Stock | AvailabilityPort | ERP |
| Content | CmsPort, PagePort | CMS |
| Cart | CartPort | Commerce Core |
| Orders | OrderPort | Commerce Core |
| Customer | CustomerPort | Commerce Core |
| Navigation | NavigationPort | CMS |
| Catalog | CollectionPort | PIM |
| Search Index | (future) | Elastic |

## Rules
- Adapters NEVER import from other adapters' data files
- Adapters NEVER do cross-domain enrichment (e.g., product adapter must not import pricing data)
- Sorting by price happens in `ProductDomainService`, not in adapters
- Block resolvers use `ProductDomainService` and `CatalogDomainService`, not raw ports
- The storefront's `lib/types.ts` re-exports from `@commerce/shared-types` — never duplicate types

## Migration Path
Mock adapters → Legacy adapters → Future backend adapters. Each can be swapped independently per-domain by changing the provider binding in the backend module.', "new_string": ""}]