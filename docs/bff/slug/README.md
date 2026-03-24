# BFF Slug Domain

## Purpose

Owns **localized path generation and normalization**. This module converts canonical entity identifiers (like `productHandle: "coilover-kit"`) into locale-aware storefront URLs (like `/es/producto/kit-coilover-ajustable`). It also normalizes all links in bootstrap and slot responses to follow the language prefix policy.

## Key Files

| File                                  | Role                                                                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `slug.service.ts`                     | High-level slug resolution for products, categories, pages                                                                  |
| `slug-mapper.service.ts`              | Maps canonical handles to localized slugs using the slug catalog. Applies language prefix policy via `withLanguagePrefix()` |
| `link-localization-policy.service.ts` | Enforces link normalization rules across all response paths                                                                 |
| `slug.types.ts`                       | Type definitions for slug catalogs                                                                                          |
| `slug.module.ts`                      | NestJS module wiring                                                                                                        |

## Link Localization Policy

All internal links in the system must follow these rules:

- **Default language** for the current domain: links are **unprefixed** (e.g., `/product/coilover-kit`)
- **Non-default language**: links are **prefixed** (e.g., `/es/producto/kit-coilover-ajustable`)

This applies to every link surface: page content, slot data, navigation menus, cart paths, breadcrumbs.

## Slug Catalogs

The slug catalogs are defined in `mock-data.ts` and provided via the `SlugCatalogPort`:

- `staticRouteSegmentCatalog` — localized static segments (e.g., `product` → `producto` in Spanish)
- `productSlugCatalog` — product handle → localized slug per language
- `categorySlugCatalog` — category handle → localized slug per language
- `pageSlugCatalog` — page handle → localized slug per language

## How It Works

1. Route recognition uses the slug catalogs to match incoming localized paths to canonical handles
2. Page assemblers use the slug service to generate localized paths for all entities in their content
3. Bootstrap orchestrator runs link localization normalization as the final step before response
4. Debug mode can include a `localizationAudit` in the response showing non-compliant links

## Fallback Behavior

If a translated slug is missing for a language, the system falls back to the canonical (English) slug. This is expected and acceptable until translation coverage is complete. The fallback is logged and can be surfaced in audits.

## Interactions

- **Route Recognition**: Uses slug catalogs to match incoming paths
- **Page Assemblers**: Use slug service to build all entity paths
- **I18n**: Locale context determines which language's slugs to use
- **Bootstrap Orchestrator**: Runs link normalization as final pipeline step
