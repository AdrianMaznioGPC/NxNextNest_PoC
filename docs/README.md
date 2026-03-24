# Architecture Documentation

This folder contains domain-by-domain documentation for every module in the Commerce Monorepo. It is the primary reference for understanding how the BFF and storefront are organized, what each module does, and how they interact.

---

## How This Documentation Is Organized

Each BFF and storefront domain has its own `README.md` explaining:

1. **Purpose** — what the module is responsible for
2. **Key Files** — the primary source files to read
3. **Inputs and Outputs** — what data flows in and out
4. **How It Works** — the internal logic and interactions with other modules
5. **Notes** — operational details, gotchas, and extension guidance

---

## System Overview

The platform is a server-rendered, multi-store, multi-language ecommerce storefront:

- **One storefront app** using a catch-all App Router route (`app/[[...page]]/page.tsx`)
- **One NestJS BFF** as orchestration and routing authority
- **A slot-manifest architecture** for streaming and deferred content
- **Store-level experience and theme control** owned by BFF metadata
- **Region-domain + language-path URL semantics** (domain determines region; path prefix determines language)

The storefront never makes routing, experience, merchandising, or i18n decisions. It renders whatever the BFF bootstrap contract instructs.

---

## Cross-Cutting Documents

| Document                                             | Description                                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`page-pipeline.md`](./page-pipeline.md)             | Mermaid diagrams showing end-to-end flow for every page type: home, category, PDP, search, cart, checkout |
| [`shared-types/README.md`](./shared-types/README.md) | The `@commerce/shared-types` contract library that both apps depend on                                    |
| [`../product-vision.md`](../product-vision.md)       | Complete architecture decisions, ownership model, runtime lifecycle, and API contracts                    |
| [`../play.md`](../play.md)                           | Hands-on developer playbook for running and configuring the system                                        |

---

## BFF Domain Docs

The BFF is organized into NestJS modules, each owning a specific domain. They are wired together in `apps/bff/src/app.module.ts`.

| Domain            | Doc                                                   | What It Does                                                                                                        |
| ----------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Page Data**     | [`bff/page-data/`](./bff/page-data/README.md)         | Core bootstrap pipeline: route recognition → assembly → slot planning → experience/merchandising overlay → response |
| **Experience**    | [`bff/experience/`](./bff/experience/README.md)       | Store/route experience profiles, marketing overlays, CMS block overrides, slot variant selection                    |
| **Merchandising** | [`bff/merchandising/`](./bff/merchandising/README.md) | Commercial strategy modes (discovery/conversion/clearance), default sort, slot variant overrides                    |
| **I18n**          | [`bff/i18n/`](./bff/i18n/README.md)                   | Locale resolution, domain config, message catalogs, cross-region URL switching                                      |
| **Slug**          | [`bff/slug/`](./bff/slug/README.md)                   | Localized path generation, link normalization, language prefix policy                                               |
| **Cart**          | [`bff/cart/`](./bff/cart/README.md)                   | Cart session handling, cookie lifecycle, cart mutations                                                             |
| **Checkout**      | [`bff/checkout/`](./bff/checkout/README.md)           | Checkout configuration, order placement, address schema                                                             |
| **Product**       | [`bff/product/`](./bff/product/README.md)             | Product detail and listing data                                                                                     |
| **Collection**    | [`bff/collection/`](./bff/collection/README.md)       | Category list and category detail data                                                                              |
| **Menu**          | [`bff/menu/`](./bff/menu/README.md)                   | Navigation data (mega menu, featured links)                                                                         |
| **Customer**      | [`bff/customer/`](./bff/customer/README.md)           | Address book management for checkout                                                                                |
| **Page**          | [`bff/page/`](./bff/page/README.md)                   | Legacy page endpoints (superseded by page-data)                                                                     |
| **System**        | [`bff/system/`](./bff/system/README.md)               | Cache policy, load shedding, resilience, metrics                                                                    |

---

## Storefront Domain Docs

The storefront is organized into component/library domains, each owning a specific UI or infrastructure concern.

| Domain            | Doc                                                                 | What It Does                                                                 |
| ----------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Page Renderer** | [`storefront/page-renderer/`](./storefront/page-renderer/README.md) | Maps BFF slot manifests to React server components via the renderer registry |
| **Cart**          | [`storefront/cart/`](./storefront/cart/README.md)                   | Client-side cart state, mutations, drawer/page cart UI                       |
| **Checkout**      | [`storefront/checkout/`](./storefront/checkout/README.md)           | Slot-based checkout flows (single-page, multi-step, express), order summary  |
| **Layout**        | [`storefront/layout/`](./storefront/layout/README.md)               | Navbar, footer, breadcrumbs, search, store selector modal                    |
| **CMS**           | [`storefront/cms/`](./storefront/cms/README.md)                     | CMS block rendering for home and content pages                               |
| **Product**       | [`storefront/product/`](./storefront/product/README.md)             | Product-specific UI: gallery, variant selector, description                  |
| **Grid**          | [`storefront/grid/`](./storefront/grid/README.md)                   | Low-level visual grid primitives                                             |
| **Icons**         | [`storefront/icons/`](./storefront/icons/README.md)                 | Shared iconography and brand marks                                           |

---

## Understanding the Bootstrap Flow

If you are new to this codebase, the most important concept is the **bootstrap flow**. Every page load follows this path:

1. Browser requests a URL like `/es/producto/kit-coilover-ajustable`
2. Storefront middleware resolves the host to a store context and extracts the language prefix
3. The catch-all route calls `getRequestBootstrap()` which fetches `BFF /page-data/bootstrap`
4. The BFF recognizes the route, resolves experience and merchandising, assembles the page, plans slots, and returns a `PageBootstrapModel`
5. The storefront renders `ResolvedPageRendererV2` which iterates over the slot manifest
6. Each `SlotBoundary` either renders inline props immediately or fetches deferred data via `/page-data/slot` (streamed through `Suspense`)
7. The `slot-renderer-registry` maps `rendererKey + variantKey` to the actual React server component

This is the single most important flow to understand. Everything else — experience, merchandising, theming, i18n — feeds into the data that the bootstrap returns.
