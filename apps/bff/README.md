# BFF App

NestJS 11 backend-for-frontend that owns route recognition, page composition, experience/merchandising resolution, i18n, and cart lifecycle. Returns `PageBootstrapModel` slot manifests consumed by the storefront.

**Port**: 4000 | **Framework**: NestJS 11 + Fastify | **Data**: Mock adapters (in-memory)

## Domain Docs

| Domain        | Doc                                                                 | What It Does                                                     |
| ------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Page Data     | [`docs/bff/page-data/`](../../docs/bff/page-data/README.md)         | Core bootstrap pipeline: route → assembly → slots → response     |
| Experience    | [`docs/bff/experience/`](../../docs/bff/experience/README.md)       | Store/route profiles, marketing overlays, slot variant selection |
| Merchandising | [`docs/bff/merchandising/`](../../docs/bff/merchandising/README.md) | Strategy modes, default sort, slot overrides                     |
| I18n          | [`docs/bff/i18n/`](../../docs/bff/i18n/README.md)                   | Locale resolution, domain config, messages, URL switching        |
| Slug          | [`docs/bff/slug/`](../../docs/bff/slug/README.md)                   | Localized path generation, link normalization                    |
| Cart          | [`docs/bff/cart/`](../../docs/bff/cart/README.md)                   | Cart session, cookie lifecycle, mutations                        |
| Checkout      | [`docs/bff/checkout/`](../../docs/bff/checkout/README.md)           | Checkout config, order placement                                 |
| Product       | [`docs/bff/product/`](../../docs/bff/product/README.md)             | Product detail and listing data                                  |
| Collection    | [`docs/bff/collection/`](../../docs/bff/collection/README.md)       | Category list and detail data                                    |
| Menu          | [`docs/bff/menu/`](../../docs/bff/menu/README.md)                   | Navigation data (mega menu, featured links)                      |
| Customer      | [`docs/bff/customer/`](../../docs/bff/customer/README.md)           | Address book for checkout                                        |
| Page          | [`docs/bff/page/`](../../docs/bff/page/README.md)                   | Legacy page endpoints                                            |
| System        | [`docs/bff/system/`](../../docs/bff/system/README.md)               | Cache, load shedding, resilience, metrics                        |

## Key Files

| File                                                         | Purpose                                  |
| ------------------------------------------------------------ | ---------------------------------------- |
| `src/app.module.ts`                                          | Module wiring and adapter selection      |
| `src/main.ts`                                                | Fastify bootstrap, request logging, CORS |
| `src/modules/page-data/bootstrap-orchestrator.service.ts`    | End-to-end bootstrap orchestration       |
| `src/modules/page-data/slot-planner.service.ts`              | Slot planning rules                      |
| `src/modules/page-data/routing/route-recognition.service.ts` | Route classification                     |
| `src/adapters/mock/mock-data.ts`                             | All mock data and domain config          |

## Adapter Architecture

The BFF uses a **ports-and-adapters** pattern. Business logic depends on port interfaces (`src/ports/`), not concrete data sources. Currently `MockCommerceModule` provides all commerce ports. The directive provider is swappable via `DIRECTIVE_PROVIDER` env (`mock` or `launchdarkly`).

## See Also

- [Page Pipeline](../../docs/page-pipeline.md)
- [Shared Types](../../libs/shared-types/README.md)
- [Architecture Docs](../../docs/README.md)
