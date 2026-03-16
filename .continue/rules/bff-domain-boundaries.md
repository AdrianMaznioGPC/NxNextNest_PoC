---
globs: apps/bff/src/**/*.ts
---

The BFF uses a hexagonal architecture with clear domain boundaries:

## Domains & Their Ports
- **Product**: `ProductPort` — product catalog data (PIM)
- **Pricing**: `PricingPort` — prices from ERP/SAP (separate from product)
- **Availability**: `AvailabilityPort` — stock/availability from ERP (separate from product)
- **Content**: `CmsPort`, `PagePort` — CMS content and static pages
- **Cart**: `CartPort` — shopping cart operations
- **Order**: `OrderPort` — order management (stub)
- **Customer**: `CustomerPort` — customer data (stub)
- **Navigation**: `NavigationPort` — mega menu, featured links
- **Menu**: `MenuPort` — header/footer menus
- **Collection**: `CollectionPort` — category/collection catalog

## Rules
1. Ports live in `apps/bff/src/ports/` and are self-contained (no imports from modules)
2. CMS raw block types live in `ports/cms.types.ts`, not in block resolver files
3. Adapters live in `apps/bff/src/adapters/{backend-name}/` (e.g., mock/, pim/, erp/)
4. Domain services live alongside their module (e.g., `ProductDomainService` in `modules/product/`)
5. `PageDataService` is a thin orchestrator — it delegates to domain services, never directly injects ports
6. The storefront's `lib/types.ts` re-exports from `@commerce/shared-types` — never duplicate types
7. Pricing and availability are separate domains from Product — when adding real backends, these will come from ERP/SAP independently