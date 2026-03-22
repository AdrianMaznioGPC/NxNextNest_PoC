# BFF App

This app is the backend-for-frontend for the storefront. It exposes commerce APIs, localized routing, bootstrap-based page composition, checkout configuration, and the current experience and merchandising layer.

## Main Responsibilities

- resolve incoming localized routes into canonical page intent
- assemble route-specific page models
- convert page models into slot manifests for the storefront
- apply experience and merchandising rules to those slots
- expose direct commerce endpoints for cart, checkout, product, collection, menu, and i18n

## Domain Map

### Page orchestration
- `src/modules/page-data`: the main bootstrap pipeline
- `src/modules/page`: older direct page endpoints
- `src/modules/slug`: localized path generation and link normalization
- `src/modules/system`: cache policy, resilience, load shedding, metrics

### Experience and commercial logic
- `src/modules/experience`: store/route experience profiles, marketing-driven overlays, and slot overrides
- `src/modules/merchandising`: commercial variants, merchandising mode, default sort behavior

### Commerce-facing domains
- `src/modules/cart`: cart session and cart cookie handling
- `src/modules/checkout`: checkout config and order endpoints
- `src/modules/product`: product endpoints
- `src/modules/collection`: collection/category endpoints
- `src/modules/customer`: address book endpoints
- `src/modules/menu`: navigation/menu endpoints
- `src/modules/i18n`: locale resolution, messages, alternates, and URL switching

## Key Files

- `src/app.module.ts`: application wiring
- `src/modules/page-data/bootstrap-orchestrator.service.ts`: end-to-end bootstrap orchestration
- `src/modules/page-data/slot-planner.service.ts`: slot planning rules
- `src/modules/page-data/routing/route-recognition.service.ts`: route classification
- `src/modules/experience/experience-resolver.service.ts`: resolves the final experience profile and applies slot rules
- `src/modules/merchandising/merchandising-resolver.service.ts`: applies merchandising rules to slots

## Request Flow

1. Storefront calls `/page-data/bootstrap`
2. BFF recognizes the route
3. BFF resolves experience and merchandising context
4. A route-specific assembler builds a `ResolvedPageModel`
5. Slot planning turns that into slot manifests
6. Experience and merchandising adjust the slot manifests
7. The final `PageBootstrapModel` is returned to the storefront

## Checkout

Checkout now participates in the same bootstrap pipeline as the rest of the site.

- route kind: `checkout`
- assembler: `src/modules/page-data/assemblers/checkout-page.assembler.ts`
- slot planner branch: `page.checkout-header`, `page.checkout-main`, `page.checkout-summary`
- checkout flow selection is driven by the `page.checkout-main` slot `variantKey`

## Mocked Experience Testing

Use query params to test mocked campaign and customer-profile-driven experiences:

- `/?customerProfile=returning`
- `/?campaign=paid-social-discovery`
- `/?customerProfile=returning&campaign=paid-social-discovery`
- `/checkout?customerProfile=returning&campaign=email-reorder`
- `/?customerProfile=vip&campaign=vip-reengagement`

## See Also

- [`../../docs/page-pipeline.md`](../../docs/page-pipeline.md)
- [`../../docs/bff/experience/README.md`](../../docs/bff/experience/README.md)
- [`../../libs/shared-types/README.md`](../../libs/shared-types/README.md)
