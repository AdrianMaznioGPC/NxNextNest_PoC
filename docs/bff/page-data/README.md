# BFF Page Data Domain

## Purpose

This is the **central orchestration domain** of the entire system. Every page the user sees flows through this module. It takes an incoming request path, recognizes the route, resolves experience and merchandising context, assembles route-specific content, plans a slot manifest, and returns the final `PageBootstrapModel` that the storefront renders.

If you are new to the codebase, **start here**. This module ties together every other BFF domain.

## Key Files

| File                                   | Role                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `bootstrap-orchestrator.service.ts`    | Top-level orchestrator that runs the full pipeline                                                 |
| `page-data.controller.ts`              | HTTP endpoints: `/page-data/bootstrap`, `/page-data/slot`, `/page-data/layout`                     |
| `page-data.service.ts`                 | Legacy page-data service (being replaced by bootstrap)                                             |
| `slot-planner.service.ts`              | Converts resolved page content into `SlotManifest[]`                                               |
| `slot-data.service.ts`                 | Handles deferred slot data fetches (`/page-data/slot`)                                             |
| `assemblers/*`                         | One assembler per route kind (home, category-detail, product-detail, search, cart, checkout, etc.) |
| `routing/route-recognition.service.ts` | Classifies incoming paths into route kinds using `path-to-regexp`                                  |
| `routing/route-matcher.factory.ts`     | Compiles per-locale route matchers                                                                 |

## Bootstrap Pipeline (Step by Step)

This is the exact sequence that `BootstrapOrchestratorService.buildBootstrap()` follows:

1. **Locale resolution** — Resolves the full `LocaleContext` from query params (locale, language, region, currency, market, domain)
2. **Route recognition** — `RouteRecognitionService` matches the incoming path against compiled `path-to-regexp` rules for the current language. Produces a `routeKind` (e.g., `product-detail`) and extracted params (e.g., `productHandle`)
3. **Experience resolution** — `ExperienceResolverService.resolve()` determines the experience profile for this store + route + customer/campaign signals. This happens _before_ assembly so assemblers can react to it
4. **Merchandising resolution** — `MerchandisingResolverService.resolve()` determines the merchandising mode and may inject default sort order
5. **Page assembly** — The matching assembler (e.g., `ProductDetailPageAssembler`) fetches domain data and builds a `ResolvedPageModel` with content nodes and revalidation tags
6. **Slot planning** — `SlotPlannerService` converts content nodes into `SlotManifest[]` entries, deciding which slots are inline/blocking vs deferred/reference
7. **Experience slot overlay** — `ExperienceResolverService.applyToSlots()` adjusts slot `variantKey`, `layoutKey`, `density`, `flags`, or removes slots (`include: false`)
8. **Merchandising slot overlay** — `MerchandisingResolverService.applyToSlots()` applies its own slot-level overrides (last wins)
9. **Link localization** — All paths in page content and slot data are normalized for the current language (prefix policy)
10. **Response assembly** — The final `PageBootstrapModel` is constructed with `page` (metadata), `shell` (messages + experience context), and `slots` (manifest)

## Endpoints

| Endpoint                   | Purpose                                                                 |
| -------------------------- | ----------------------------------------------------------------------- |
| `GET /page-data/bootstrap` | Main page composition API — returns full `PageBootstrapModel`           |
| `GET /page-data/slot`      | Deferred slot data fetch — returns `SlotPayloadModel` for a single slot |
| `GET /page-data/layout`    | Global layout data (mega menu, featured links, route paths)             |

## Route Kinds and Their Assemblers

| Route Kind        | Assembler                     | Slot Planning                                                |
| ----------------- | ----------------------------- | ------------------------------------------------------------ |
| `home`            | `HomePageAssembler`           | Single inline slot from CMS blocks                           |
| `category-list`   | `CategoryListPageAssembler`   | Single inline slot                                           |
| `category-detail` | `CategoryDetailPageAssembler` | Subcollections or products slot (assembler decides)          |
| `product-detail`  | `ProductDetailPageAssembler`  | Custom PDP plan: main (inline) + recs/reviews/faq (deferred) |
| `search`          | `SearchPageAssembler`         | Custom plan: summary (inline) + products (deferred)          |
| `content-page`    | `ContentPageAssembler`        | Single inline slot                                           |
| `cart`            | `CartPageAssembler`           | Single inline slot (gated by `cartUxMode`)                   |
| `checkout`        | `CheckoutPageAssembler`       | Header + main + summary slots                                |

## Key Design Rules

- **Route recognition** decides what page kind the request is. It does not choose FE variants.
- **Experience** chooses presentation-level differences: slot variants, layout keys, CMS block overrides.
- **Merchandising** chooses catalog-oriented behavior: default sort, variant overrides for product listings.
- **Assemblers** own data fetching and content construction. They can read the resolved experience to shape content (e.g., checkout assembler checks for express flow promotion).
- **The storefront never reconstructs these decisions.** It receives the final contract and renders it.

## Failure Modes

- Unknown routes → 404 response
- Missing assemblers → 404 response
- Cart route with `cartUxMode: "drawer"` → 404 (cart page intentionally blocked)
- Assembly failures → caught by resilience layer, degrade to 404

## See Also

- [Page Pipeline Diagrams](../../page-pipeline.md) — visual flow for every page type
- [Experience Domain](../experience/README.md) — how experience profiles are resolved
- [Merchandising Domain](../merchandising/README.md) — how merchandising modes work
- [Slug Domain](../slug/README.md) — how link localization works
