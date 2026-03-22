# BFF Experience Domain

## Purpose

Resolves store and route-specific experience configuration. It chooses layout keys, theme bindings, slot variants, and whether slots should be included.

## Key Files

- `apps/bff/src/modules/experience/experience-profile.catalog.ts`
- `apps/bff/src/modules/experience/experience-profile.service.ts`
- `apps/bff/src/modules/experience/experience-resolver.service.ts`
- `apps/bff/src/modules/experience/experience-validator.service.ts`
- `apps/bff/src/modules/experience/experience-profile.types.ts`
- `apps/bff/src/modules/experience/experience-signals.service.ts`
- `apps/bff/src/modules/experience/marketing-overlay.service.ts`
- `apps/bff/src/modules/experience/marketing-directive.types.ts`
- `apps/bff/src/ports/marketing-directive.port.ts`
- `apps/bff/src/adapters/mock/mock-marketing-directive.adapter.ts`

## How It Works

1. `ExperienceResolverService.resolve()` starts from the request `LocaleContext` and asks `ExperienceProfileService.resolveStoreContext()` for the store-level defaults bound to the current domain.
2. `ExperienceSignalsService` reads mock query params such as `customerProfile` and `campaign`, calls the `MarketingDirectiveProvider`, and merges both sources into a single `ResolvedExperienceSignals` object.
3. `ExperienceProfileService.resolveProfile()` filters `EXPERIENCE_PROFILES` by `storeKey`, `routeKind`, `customerProfile`, and `campaignKey`, then picks the most specific match using the profile scoring rules.
4. The chosen profile is merged with the store baseline. Store bindings still own theme selection, while profile rules own layout and slot behavior.
5. `MarketingOverlayService` applies the safe, high-level overlay on top of that profile. This is where discovery or re-engagement flags, hero overrides, and checkout preferences are converted into concrete slot rules.
6. Later in bootstrap, `ExperienceResolverService.applyToSlots()` projects those rules onto the slot manifest by updating `presentation.variantKey`, `layoutKey`, `density`, `flags`, and `slotRef.query`, or by dropping slots whose rule sets `include: false`.

## Selection Rules

- Store context comes from the domain config in the i18n module, not from the request query.
- Profile matching currently treats `locale` as wildcard-only; the active discriminators are store, route, customer profile, and campaign.
- Specificity is scored so route-specific profiles beat wildcard routes, and customer/campaign-targeted profiles beat generic profiles.
- Base store profiles remain the fallback even when no campaign or customer-specific profile matches.

## Runtime Effects

- Homepage assembly can replace the first hero banner with `experience.homeHero`.
- Checkout assembly can switch the checkout flow type by reading the resolved slot rule for `page.checkout-main`.
- Slot manifests receive extra revalidation tags for the experience profile, theme binding, customer profile, campaign, and active marketing directives.

## Inputs And Outputs

- Inputs: locale context, route kind, query params, store context, and marketing directives from the provider port
- Outputs: resolved experience profiles plus slot presentation overrides

## Marketing Control Boundary

Marketing directives are high-level only. They can influence:

- funnel mode
- homepage hero content
- promoted categories and products
- approved slot flags
- checkout preference hints

Marketing directives do not directly define FE components or arbitrary slot payloads.

## Mocked Testing

You can trigger mocked experience signals through query params on any page bootstrap request:

- `?customerProfile=guest`
- `?customerProfile=first-time`
- `?customerProfile=returning`
- `?customerProfile=vip`
- `?campaign=paid-social-discovery`
- `?campaign=email-reorder`
- `?campaign=vip-reengagement`

Examples:

- homepage returning customer: `/?customerProfile=returning`
- homepage paid social campaign: `/?campaign=paid-social-discovery`
- homepage returning paid social: `/?customerProfile=returning&campaign=paid-social-discovery`
- checkout email reorder: `/checkout?customerProfile=returning&campaign=email-reorder`
- homepage VIP re-engagement: `/?customerProfile=vip&campaign=vip-reengagement`

## Extension Notes

- Add new baseline experiences in `experience-profile.catalog.ts` when the rule is product-owned and deterministic.
- Add new campaign logic through `MarketingDirectiveProvider` when the signal comes from a marketing or audience system.
- Keep overlays additive and constrained. If a new requirement needs arbitrary component composition, it belongs in page-data or slot payload assembly instead of this domain.
