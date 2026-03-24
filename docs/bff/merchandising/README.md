# BFF Merchandising Domain

## Purpose

Resolves commercial presentation strategy for each request. Merchandising is a **dedicated BFF layer**, independent from theme and layout assignment, that controls how product listings and search results are presented based on store-level business goals.

## Key Files

| File                                 | Role                                                     |
| ------------------------------------ | -------------------------------------------------------- |
| `merchandising-profile.catalog.ts`   | In-code catalog of all merchandising profiles            |
| `merchandising-resolver.service.ts`  | Resolves the matching profile and applies slot overrides |
| `merchandising-validator.service.ts` | Validates profile catalog integrity                      |
| `merchandising-profile.types.ts`     | Type definitions for profiles and rules                  |
| `merchandising.module.ts`            | NestJS module wiring                                     |

## Modes

| Mode         | Purpose                                                                        |
| ------------ | ------------------------------------------------------------------------------ |
| `discovery`  | Baseline browse behavior. Default variants, no sort override.                  |
| `conversion` | Conversion-oriented variants and sort intent (e.g., trending first).           |
| `clearance`  | Sell-through variants, optional slot suppression for low-priority PDP content. |

## How Profile Resolution Works

The resolver uses a specificity-based selector chain:

1. `store + routeKind + language` (most specific)
2. `store + routeKind + *`
3. `store + * + language`
4. `store + * + *`
5. Global default (least specific)

Resolved fields include:

- `merchandisingMode` (`discovery` | `conversion` | `clearance`)
- `merchandisingProfileId`
- Optional `defaultSortSlug` (only applied when user has not provided a sort)
- `slotRules` (variant, include, layout, density, flags overrides)

## Application Order (Critical)

During bootstrap, merchandising is applied **after** experience:

1. Base slot plan from `SlotPlannerService`
2. Experience rules applied
3. **Merchandising rules applied last** (last wins)
4. User sort query always overrides merchandising default sort

This means merchandising can override experience variant selections when there is a conflict.

## Current Variant Map

| Renderer Key             | Available Variants                                 |
| ------------------------ | -------------------------------------------------- |
| `page.category-products` | `default`, `clp-list-v1`, `clp-clearance-v1`       |
| `page.search-products`   | `default`, `search-list-v1`, `search-clearance-v1` |

## How to Extend

1. Edit `merchandising-profile.catalog.ts` to add or modify profiles
2. Set the `mode`, optional `defaultSortSlug`, and `slotRules`
3. If adding a new slot variant, also register it in the storefront `slot-renderer-registry.ts`
4. Refresh the page (append `?demo=<timestamp>` for cache busting)

## Interactions

- **Page Data**: Bootstrap orchestrator calls `resolve()` then `applyToSlots()` during the pipeline
- **Experience**: Merchandising runs after experience and can override its slot decisions
- **Storefront**: Receives the final `merchandisingApplied` field in `page` and renders the chosen variants
