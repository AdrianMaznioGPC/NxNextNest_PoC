# Commerce Monorepo

A production-grade, multi-store, multi-language ecommerce platform built as an Nx monorepo. The storefront renders pages from a BFF-composed bootstrap contract using a slot-manifest architecture that supports streaming, deferred content, experience personalization, and merchandising strategy overlays.

> **Core principle**: The storefront is a thin rendering runtime. The BFF owns orchestration, route resolution, page composition, experience assignment, merchandising policy, URL generation, and i18n.

---

## Table of Contents

- [Requirements](#requirements)
- [Repository Structure](#repository-structure)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Running Locally](#running-locally)
- [Production Mode](#production-mode)
- [Environment Variables](#environment-variables)
- [Theme Catalog](#theme-catalog)
- [i18n Model](#i18n-model)
- [Key URLs](#key-urls)
- [CI / Quality Guards](#ci--quality-guards)
- [Further Reading](#further-reading)

---

## Requirements

- **Node.js >= 20.9.0** (required by Next.js 15 canary)
- **npm** (workspaces enabled; root `package.json` declares `"workspaces": ["apps/*", "libs/*"]`)
- `.npmrc` sets `legacy-peer-deps=true` for dependency compatibility

---

## Repository Structure

```
apps/
  storefront/   - Next.js 15 ecommerce frontend (port 3000)
  bff/          - NestJS 11 backend-for-frontend (port 4000)
  api/          - Java Spring Boot commerce API (Gradle, port 8080) [future]
libs/
  shared-types/ - Shared TypeScript type contracts between BFF and storefront
docs/           - Architecture and domain documentation
scripts/        - CI guard scripts (theme, i18n, CSS budget, SVG, etc.)
```

### How the pieces fit together

1. **`libs/shared-types`** defines every contract shared between the BFF and storefront: commerce models (`Product`, `Cart`, `Collection`), page composition models (`PageBootstrapModel`, `SlotManifest`, `SlotPayloadModel`), locale types, store context, checkout types, CMS block types, and navigation types. Both apps import from `@commerce/shared-types`.

2. **`apps/bff`** is a NestJS application running on Fastify. It recognizes incoming routes, resolves experience and merchandising profiles, assembles route-specific page models, plans slot manifests, and returns a `PageBootstrapModel` to the storefront. It also owns cart cookie lifecycle, i18n negotiation and message catalogs, URL switching, and direct commerce endpoints.

3. **`apps/storefront`** is a Next.js 15 App Router application. Its catch-all route (`app/[[...page]]/page.tsx`) calls the BFF bootstrap endpoint, receives the slot manifest, and renders each slot through a registry of server components. It owns the CSS theme implementation, cart/checkout UI, and page chrome (navbar, footer, store selector).

4. **`apps/api`** (future) is a Java Spring Boot backend. The BFF currently runs against `MockCommerceModule` with in-memory data; a future `SpringCommerceModule` adapter will connect the BFF to this real commerce API.

---

## Quick Start

```bash
git clone <repo-url>
cd <repo-dir>
npm install
npm run dev        # starts both storefront (port 3000) and BFF (port 4000)
```

### Local domain setup (optional, for multi-store testing)

Add to your `/etc/hosts` file:

```
127.0.0.1 storefront.example.com
127.0.0.1 storefront.es.example.com
127.0.0.1 storefront.nl.example.com
```

Then open `http://storefront.example.com:3000` to see store-specific themes, languages, and cart behavior.

---

## Architecture Overview

### Request Lifecycle

```
Browser → Storefront Middleware → Storefront RSC (catch-all) → BFF /page-data/bootstrap
                                                                    ↓
                                                        Route recognition
                                                        Experience resolution
                                                        Merchandising resolution
                                                        Page assembly + Slot planning
                                                                    ↓
                                                        ← Bootstrap JSON (page + shell + slots)
                                                                    ↓
                                                        Render inline slots immediately
                                                        Fetch deferred slots via /page-data/slot
                                                                    ↓
                                                        ← Progressive RSC stream to browser
```

### Ownership Boundary

| Concern                                        | Owner      |
| ---------------------------------------------- | ---------- |
| Route recognition, canonical entity resolution | BFF        |
| Page composition, slot planning                | BFF        |
| Experience profiles, slot variants             | BFF        |
| Merchandising modes, default sort              | BFF        |
| Theme assignment (semantic identity)           | BFF        |
| i18n negotiation, message catalogs, formatting | BFF        |
| Cart cookie lifecycle                          | BFF        |
| URL generation and slug mapping                | BFF        |
| Rendering runtime (RSC + client islands)       | Storefront |
| Theme CSS token packs (visual implementation)  | Storefront |
| Cart/checkout UI, store selector               | Storefront |
| Translation key lookup (thin)                  | Storefront |

### Slot-Manifest Architecture

The BFF does not return HTML or component trees. It returns a `PageBootstrapModel` containing:

- **`page`**: Route metadata, SEO, canonical URL, alternates, cache hints
- **`shell`**: Messages (i18n), experience context (theme, store, cart UX, merchandising mode)
- **`slots`**: An ordered array of `SlotManifest` entries, each specifying a `rendererKey`, `variantKey`, data mode (`inline` vs `reference`), priority (`critical` vs `deferred`), and stream mode (`blocking` vs `deferred`)

The storefront's `SlotBoundary` component reads each manifest entry:

- **Inline slots** render immediately from `inlineProps`
- **Deferred slots** fetch data from `/page-data/slot` and can stream via `Suspense`

The `slot-renderer-registry.ts` maps `rendererKey + variantKey` to async-imported React server components.

---

## Running Locally

```bash
npm install

# Run both apps concurrently
npm run dev

# Run individually
npm run dev:storefront   # Next.js dev server on port 3000
npm run dev:bff          # NestJS dev server on port 4000
```

- Storefront: [localhost:3000](http://localhost:3000/)
- BFF health: [localhost:4000/health](http://localhost:4000/health)

When running on `localhost` (without host-file domains), the storefront middleware falls back to `store-a` defaults (English, `theme-default`, drawer cart).

---

## Production Mode

```bash
# Build everything (shared-types → BFF → storefront)
npm run build

# Start both production servers
npm run start

# Or individually
npm run start:storefront
npm run start:bff
```

Builds use Nx `dependsOn: ["^build"]` so `shared-types` always builds before the apps.

---

## Environment Variables

### Storefront (set in `apps/storefront/.env.local`)

| Variable                               | Default                    | Purpose                                            |
| -------------------------------------- | -------------------------- | -------------------------------------------------- |
| `BFF_URL`                              | `http://localhost:4000`    | BFF base URL for server-side fetches               |
| `SITE_NAME`                            | —                          | Site title used in metadata                        |
| `REVALIDATION_SECRET`                  | —                          | Secret for `/api/revalidate` on-demand ISR         |
| `NEXT_PUBLIC_CART_API_BASE`            | `/api/cart`                | Client-side cart API base path                     |
| `NEXT_PUBLIC_CONSERVATIVE_PREFETCH`    | `true`                     | Shell links prefetch; content links do not         |
| `NEXT_PUBLIC_DEFER_SHELL_INTERACTIONS` | `true`                     | Defer cart/mobile-menu hydration until user intent |
| `DOMAIN_CONFIG_TTL_MS`                 | `0` (dev) / `60000` (prod) | Cache duration for BFF domain config               |

### BFF (set in shell or `apps/bff/.env`)

| Variable                      | Default  | Purpose                                           |
| ----------------------------- | -------- | ------------------------------------------------- |
| `DIRECTIVE_PROVIDER`          | `mock`   | `mock` or `launchdarkly` for marketing directives |
| `LAUNCHDARKLY_SDK_KEY`        | —        | Required when `DIRECTIVE_PROVIDER=launchdarkly`   |
| `BOOTSTRAP_MAX_INFLIGHT`      | `256`    | Load shedding: max concurrent bootstrap requests  |
| `SLOT_MAX_INFLIGHT`           | `512`    | Load shedding: max concurrent slot requests       |
| `MAX_CRITICAL_INLINE_BYTES`   | `24576`  | Slot planner inline payload budget                |
| `DEBUG_PDP_REVIEWS_DELAY_MS`  | `0`      | Artificial delay for PDP reviews (streaming demo) |
| `CART_COOKIE_NAME`            | `cartId` | Cart session cookie name                          |
| `INCLUDE_TIMINGS_IN_RESPONSE` | `false`  | Include timing diagnostics in responses           |

---

## Theme Catalog

The storefront is **light-only** (no dark mode, enforced by CI guard). Three theme token packs exist:

| Theme Key       | Accent | Control Radius | Store                                   |
| --------------- | ------ | -------------- | --------------------------------------- |
| `theme-default` | Blue   | Medium         | `store-a` (`storefront.example.com`)    |
| `theme-green`   | Green  | Full           | `store-b` (`storefront.es.example.com`) |
| `theme-orange`  | Orange | Medium         | `store-c` (`storefront.nl.example.com`) |

The BFF returns the semantic theme identity (`themeKey`, `themeTokenPack`, `themeRevision`). The storefront maps it to a CSS file via `lib/theme/token-pack-registry.ts` and loads it as a `<link>` in the root layout.

---

## i18n Model

Storefront i18n is **BFF-authoritative**:

1. BFF resolves locale context from domain + language prefix
2. BFF returns pre-formatted message catalogs in `bootstrap.shell.messages`
3. Storefront performs thin key lookup via `useT(namespace)` — no `next-intl`, no locale JSON files
4. BFF owns interpolation, pluralization, and formatting via `IntlMessageFormat`

### URL Model

- **Region** comes from the domain host (e.g., `storefront.es.example.com` → ES context)
- **Language** comes from an optional path prefix (`/es/...`, `/nl/...`)
- Default language is unprefixed; non-default languages are prefixed
- Default-language prefixed URLs redirect 301 to unprefixed canonical

---

## Key URLs

| Route            | Example                                |
| ---------------- | -------------------------------------- |
| Home             | `/`                                    |
| Category list    | `/categories` (or localized segment)   |
| Category detail  | `/categories/brakes` (or localized)    |
| Product detail   | `/product/coilover-kit` (or localized) |
| Search           | `/search?q=brake`                      |
| Cart (page mode) | `/cart` (or localized)                 |
| Checkout         | `/checkout`                            |

---

## CI / Quality Guards

```bash
npm run storefront:theme:ci   # Runs ALL guards below
```

| Script                       | What it checks                                |
| ---------------------------- | --------------------------------------------- |
| `theme:guard`                | No hardcoded color values in components       |
| `theme:catalog:guard`        | Theme contrast requirements                   |
| `theme:light-only:guard`     | No dark mode classes/markers                  |
| `i18n:runtime:guard`         | No `next-intl` imports in storefront          |
| `branding:svg-network:guard` | No SVG file imports (flags load over network) |
| `theme-pack:wiring`          | Theme pack registry matches CSS files         |
| `storefront:css:budget`      | CSS output size budget                        |

Run `npm run prettier` before committing. Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.

---

## Further Reading

- [Architecture Docs](./docs/README.md) — domain-by-domain documentation for BFF and storefront
- [Page Pipeline Diagrams](./docs/page-pipeline.md) — Mermaid diagrams for every page type
- [Product Vision](./product-vision.md) — full architecture decisions, ownership model, and contracts
- [Developer Playbook](./play.md) — hands-on guide to run and configure behavior
- [Storefront README](./apps/storefront/README.md) — storefront-specific documentation
- [BFF README](./apps/bff/README.md) — BFF-specific documentation
- [Shared Types README](./libs/shared-types/README.md) — contract library documentation
