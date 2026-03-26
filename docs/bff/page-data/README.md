# BFF Page Data Domain

## Purpose

This is the **central orchestration domain** of the entire system. Every page the user sees flows through this module. It takes an incoming request path, recognizes the route, resolves experience and merchandising context, assembles route-specific content, plans a slot manifest, and returns the final `PageBootstrapModel` that the storefront renders.

If you are new to the codebase, **start here**. This module ties together every other BFF domain.

## Key Files

| File                                      | Role                                                                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `bootstrap-orchestrator.service.ts`       | Top-level orchestrator that runs the stage pipeline                                                |
| `bootstrap/bootstrap-stage.factory.ts`    | Creates ordered pipeline of bootstrap stages                                                       |
| `bootstrap/bootstrap-response.builder.ts` | Builds final PageBootstrapModel response from context                                              |
| `bootstrap/bootstrap-context.model.ts`    | Mutable context passed through all stages                                                          |
| `stages/*`                                | Individual pipeline stages (route recognition, assembly, personalization, etc.)                    |
| `page-data.controller.ts`                 | HTTP endpoints: `/page-data/bootstrap`, `/page-data/slot`, `/page-data/layout`                     |
| `page-data.service.ts`                    | Legacy page-data service (being replaced by bootstrap)                                             |
| `slot-planner.service.ts`                 | Converts resolved page content into `SlotManifest[]`                                               |
| `slot-data.service.ts`                    | Handles deferred slot data fetches (`/page-data/slot`)                                             |
| `assemblers/*`                            | One assembler per route kind (home, category-detail, product-detail, search, cart, checkout, etc.) |
| `routing/route-recognition.service.ts`    | Classifies incoming paths into route kinds using `path-to-regexp`                                  |
| `routing/route-matcher.factory.ts`        | Compiles per-locale route matchers                                                                 |

## Bootstrap Pipeline Architecture

The bootstrap pipeline uses a **stage-based architecture** where each stage implements the `BootstrapStage` interface and operates on a shared `BootstrapContext`. This makes the pipeline extensible, testable, and easier to reason about.

### Pipeline Stages (Execution Order)

The orchestrator executes stages in this fixed order via `BootstrapStageFactory.createPipeline()`:

1. **RouteRecognitionStage** — Resolves `LocaleContext` and matches incoming path against route rules. Sets `ctx.route`, `ctx.localeContext`, `ctx.matchedRuleId`. Detects 404/301 early but does not stop processing (shell data still needed).

2. **ContextResolutionStage** — Resolves experience profile (store, theme, cart UX) and merchandising profile (mode, default sort). Sets `ctx.experience`, `ctx.merchandising`, applies default sort to query if needed. Always runs to populate shell, even for 404/301.

3. **AssemblyCacheStage** — (Future) Checks assembly cache for pre-built content. Currently a stub that always misses.

4. **PageAssemblyStage** — Executes route-specific assembler to build content. Skipped if `ctx.status !== 200`. Validates cart route against `cartUxMode`. Calls assembler with timeout/resilience. Sets `ctx.content`, `ctx.seo`, `ctx.revalidateTags`, `ctx.assemblerKey`. On failure, calls `ctx.earlyReturn(404)`.

5. **SlotPlanningStage** — Converts `ctx.content` into `ctx.slots` manifest. Skipped if status is 404/301. Uses `SlotPlannerService` to determine inline vs deferred slots.

6. **PersonalizationStage** — Applies experience and merchandising overlays to slots (variant keys, layout keys, density, include flags). Skipped if status is 404/301. Experience overlay runs first, merchandising overlay runs second (last wins).

7. **LinkLocalizationStage** — Normalizes all internal paths in content and slots for current locale. Audits link compliance and logs violations. Always runs (even for 404/301) to ensure consistent paths in shell.

### Stage Execution Rules

- Each stage can mutate the `BootstrapContext`
- Stages check `ctx.shouldStopProcessing()` before executing
- Stages can implement `shouldRun(ctx)` for conditional execution
- Early return is signaled via `ctx.earlyReturn(status, redirectTo?)`
- Timing is tracked per stage for observability

### Adding a New Stage

1. Implement `BootstrapStage` interface in `stages/<name>.stage.ts`
2. Add `shouldRun(ctx)` if stage should be conditional
3. Register in `page-data.module.ts` providers
4. Inject into `BootstrapStageFactory` and add to `createPipeline()` array
5. Write unit test in `stages/<name>.stage.spec.ts`

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

## Cache Boundaries

The bootstrap pipeline has several potential cache points:

1. **Assembly Cache** (stage 3) — Future cache for assembled page content. Currently not implemented.
2. **CDN Cache** — Final response cached at CDN layer based on `page.cacheHints` (TTL, public/private).
3. **Slot Data Cache** — Deferred slot data may be cached independently via `/page-data/slot` endpoint.

Cache invalidation uses `revalidateTags` from assemblers (e.g., `product:123`, `collection:abc`).

## See Also

- [Bootstrap Refactor Documentation](../../refactoring/bootstrap-orchestrator-refactor.md) — detailed refactoring plan and design decisions
- [Page Pipeline Diagrams](../../page-pipeline.md) — visual flow for every page type
- [Experience Domain](../experience/README.md) — how experience profiles are resolved
- [Merchandising Domain](../merchandising/README.md) — how merchandising modes work
- [Slug Domain](../slug/README.md) — how link localization works
