# Storefront App

Next.js 15 App Router storefront that renders BFF-composed page bootstrap contracts using a slot-manifest architecture with streaming and deferred content.

**Port**: 3000 | **Framework**: Next.js 15 + React 19 | **Styling**: Tailwind CSS 4 | **Font**: Geist Sans

## Core Principle

The storefront is a **thin rendering runtime**. It does not make routing, experience, merchandising, or i18n decisions. It renders whatever the BFF bootstrap contract instructs.

## Domain Docs

| Domain        | Doc                                                                               | What It Does                                                                 |
| ------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Page Renderer | [`docs/storefront/page-renderer/`](../../docs/storefront/page-renderer/README.md) | Maps BFF slot manifests to React server components via the renderer registry |
| Cart          | [`docs/storefront/cart/`](../../docs/storefront/cart/README.md)                   | Client-side cart state, mutations, drawer/page cart UI                       |
| Checkout      | [`docs/storefront/checkout/`](../../docs/storefront/checkout/README.md)           | Slot-based checkout flows (single-page, multi-step, express)                 |
| Layout        | [`docs/storefront/layout/`](../../docs/storefront/layout/README.md)               | Navbar, footer, breadcrumbs, search, store selector                          |
| CMS           | [`docs/storefront/cms/`](../../docs/storefront/cms/README.md)                     | CMS block rendering for home and content pages                               |
| Product       | [`docs/storefront/product/`](../../docs/storefront/product/README.md)             | Product gallery, variant selector, description                               |
| Grid          | [`docs/storefront/grid/`](../../docs/storefront/grid/README.md)                   | Low-level visual grid primitives                                             |
| Icons         | [`docs/storefront/icons/`](../../docs/storefront/icons/README.md)                 | Shared iconography and brand marks                                           |

## Key Files

| File                                                 | Purpose                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| `app/layout.tsx`                                     | Root shell: theme, i18n messages, cart context, navbar/footer |
| `app/[[...page]]/page.tsx`                           | Catch-all route: fetches bootstrap, renders slot manifest     |
| `app/checkout/page.tsx`                              | Checkout route with dedicated shell                           |
| `middleware.ts`                                      | Resolves host → store context, extracts language prefix       |
| `lib/bootstrap.ts`                                   | Per-request cached bootstrap fetch                            |
| `lib/api/index.ts`                                   | All BFF fetch functions                                       |
| `lib/theme/token-pack-registry.ts`                   | Maps theme keys to CSS files                                  |
| `lib/i18n/messages-context.tsx`                      | `useT(namespace)` translation hook                            |
| `components/page-renderer/slot-renderer-registry.ts` | Maps `rendererKey + variantKey` → React components            |
| `components/page-renderer/slot-boundary.tsx`         | Inline vs deferred slot rendering                             |

## See Also

- [Page Pipeline Diagrams](../../docs/page-pipeline.md)
- [Shared Types](../../libs/shared-types/README.md)
- [Architecture Docs](../../docs/README.md)
