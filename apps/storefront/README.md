# Storefront App

This app is the Next.js storefront. It renders the BFF bootstrap contract, owns page shell/layout UI, and provides the interactive cart and checkout experiences.

## Main Responsibilities

- request page bootstrap data from the BFF
- render slot manifests into real React components
- provide global layout, navigation, theme, cart, and i18n context
- execute cart and checkout interactions against the BFF
- host route-specific shells like checkout while still using the shared bootstrap contract

## Domain Map

### Rendering and composition
- `components/page-renderer`: slot rendering, renderer registry, slot boundaries, compatibility node renderers
- `app/[[...page]]`: catch-all slot-based page route
- `app/checkout`: dedicated checkout route shell using bootstrap slots

### Commerce UI
- `components/cart`: cart state, cart UX, cart mutations, drawer/page cart UI
- `components/checkout`: slot-based checkout flows and order summary synchronization
- `components/product`: PDP-focused UI components

### Content and shared presentation
- `components/cms`: CMS block rendering
- `components/layout`: navbar, footer, breadcrumbs, search, store selector, layout primitives
- `components/grid`: lower-level merchandising layout primitives
- `components/icons`: shared iconography

### App support layers
- `lib/api`: BFF fetch layer
- `lib/bootstrap.ts`: request bootstrap helper
- `lib/i18n`: locale and messages helpers
- `lib/theme`: theme token pack resolution

## Key Files

- `app/layout.tsx`: root storefront shell
- `app/[[...page]]/page.tsx`: generic slot-based page route
- `app/checkout/page.tsx`: checkout route entrypoint
- `components/page-renderer/slot-boundary.tsx`: inline vs deferred slot execution
- `components/page-renderer/slot-renderer-registry.ts`: FE renderer registry
- `components/checkout/checkout-slot-state.tsx`: shared checkout slot state
- `lib/api/index.ts`: BFF API calls

## Rendering Flow

1. Route calls `getRequestBootstrap()`
2. Storefront receives `PageBootstrapModel`
3. Layout reads shell data like messages and experience context
4. `SlotBoundary` resolves each slot
5. `slot-renderer-registry` maps `rendererKey` plus `variantKey` to React components
6. Components render using the shared contracts from `libs/shared-types`

## Checkout

Checkout is no longer a standalone FE-only page composition.

- `/checkout` still has a dedicated route shell
- the shell renders `page.checkout-header`, `page.checkout-main`, and `page.checkout-summary`
- `page.checkout-main` variant selects `SinglePageCheckout`, `MultiStepCheckout`, or `ExpressCheckout`
- checkout main and summary stay in sync through `components/checkout/checkout-slot-state.tsx`

## See Also

- [`../../docs/page-pipeline.md`](../../docs/page-pipeline.md)
- [`../../libs/shared-types/README.md`](../../libs/shared-types/README.md)