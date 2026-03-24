# BFF I18n Domain

## Purpose

Owns all internationalization logic: locale resolution, domain-to-store mapping, translation message catalogs, URL alternates, and cross-region URL switching. The BFF is **authoritative** for i18n — the storefront has no `next-intl` dependency and performs only thin key lookups.

## Key Files

| File                    | Role                                                                    |
| ----------------------- | ----------------------------------------------------------------------- |
| `i18n.service.ts`       | Core locale resolution, message catalog assembly, alternates generation |
| `i18n.controller.ts`    | HTTP endpoints for domain config, messages, and switch-url              |
| `switch-url.service.ts` | Cross-region/language URL resolution                                    |

## Endpoints

| Method | Path                  | Purpose                                                                                        |
| ------ | --------------------- | ---------------------------------------------------------------------------------------------- |
| `GET`  | `/i18n/domain-config` | Domain-store bindings, language matrix, theme/cart/branding metadata. Returns ETag for caching |
| `GET`  | `/i18n/messages`      | Locale namespace message payloads (debug/supporting surface)                                   |
| `POST` | `/i18n/switch-url`    | Resolves canonical target URL when switching region or language                                |

## URL Model

The platform uses **region-domain + language-path** semantics:

- **Region** comes from the domain host (e.g., `storefront.es.example.com` → ES context)
- **Language** comes from an optional path prefix (`/es/...`, `/nl/...`, `/fr/...`)
- **Default language** for a domain is unprefixed (e.g., `storefront.es.example.com/producto/...` is Spanish)
- **Non-default languages** are prefixed (e.g., `storefront.es.example.com/en/product/...` is English on the ES store)
- **Default-language prefixed URLs** redirect 301 to the unprefixed canonical

## Domain Config

The `domainConfig` in mock data defines all stores:

| Domain                      | Store     | Default Language | Theme           | Cart UX  |
| --------------------------- | --------- | ---------------- | --------------- | -------- |
| `storefront.example.com`    | `store-a` | `en`             | `theme-default` | `drawer` |
| `storefront.es.example.com` | `store-b` | `es`             | `theme-green`   | `page`   |
| `storefront.nl.example.com` | `store-c` | `nl`             | `theme-orange`  | `page`   |

All stores support languages: `en`, `es`, `nl`, `fr`.

## How Translation Works

1. BFF assembles message catalogs by locale from mock data (`messageCatalogByLocale`)
2. Bootstrap response includes `shell.messages` keyed by namespace (e.g., `common`, `nav`, `cart`, `page`)
3. BFF performs interpolation and pluralization via `IntlMessageFormat`
4. Storefront does thin key access: `useT('nav')('cart_title')` returns the pre-formatted string

## Store Selector / URL Switching

When a user changes region or language via the store selector:

1. Client posts to storefront `/api/i18n/switch`
2. Storefront proxies to BFF `POST /i18n/switch-url`
3. BFF resolves the canonical target URL for the new region/language (translating slugs if available)
4. Storefront sets `pref_region` + `pref_lang` cookies
5. Client hard navigates with `window.location.assign(targetUrl)` for clean state reset

## Interactions

- **Middleware**: Storefront middleware calls `/i18n/domain-config` (cached) to resolve host → store context
- **Page Data**: Bootstrap pipeline uses locale context from this domain for route recognition and message assembly
- **Slug**: Link localization depends on locale context for prefix policy decisions
