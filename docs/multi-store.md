# Multi-Store

## Overview

The platform supports multiple storefronts from a single deployment. Each store has its own locale, currency, language, content, and domain. Currently two stores are configured: France (`fr`) and Ireland (`ie`).

## Store Configuration (`libs/store-config/`)

```typescript
export type StoreConfig = {
  storeCode: string;    // "fr" | "ie"
  locale: string;       // "fr-FR" | "en-IE"
  currency: string;     // "EUR"
  currencySymbol: string;
  language: string;     // "fr" | "en"
  siteName: string;     // "Winparts France"
  label: string;        // "France"
  flag: string;         // 🇫🇷
  domain: string;       // "winparts.fr.localhost"
};
```

`resolveStoreFromHostname(hostname)` finds the matching store by checking if the hostname contains the store's domain.

## Request Flow

### Storefront Side

1. **Caddy** (`Caddyfile`) routes `winparts.fr.localhost` and `winparts.ie.localhost` to port 3000.
2. **Next.js middleware** (`middleware.ts`) calls `resolveStoreFromHostname()` with the `host` header. Sets `x-store-code` on the forwarded request headers.
3. **`getStoreCode()`** in the API client reads `x-store-code` from the server-side headers.
4. **`i18n/request.ts`** uses the store code to resolve the language and load the correct message bundle (`messages/en.json` or `messages/fr.json`).

### BFF Side

1. **`StoreInterceptor`** (global NestJS interceptor) reads `x-store-code` from request headers. Falls back to `defaultStoreCode` ("fr"). Resolves the full store config. Attaches store context to the request object.
2. **`StoreContext`** (request-scoped injectable) provides `storeCode`, `locale`, `currency`, and `customerId` to any service that needs it.
3. **Mock adapters** use `StoreContext` to select store-specific data (products, pricing, collections, CMS content, etc.).

## What Differs Per Store

| Data | How It Varies |
|------|--------------|
| Products | Different handles, titles, descriptions (localized) |
| Pricing | Different prices per store |
| Availability | Different stock status per store |
| Collections | Different handles and titles (localized) |
| CMS content | Fully localized homepage blocks, testimonials |
| Navigation | Localized menu items and featured links |
| Static pages | Localized body content |
| Checkout | Different address schemas (FR has postal code, IE has Eircode/county), delivery options, payment options |
| Sort labels | "Prix : croissant" vs "Price: Low to high" |

## Store Switcher

The `StoreSwitcher` client component renders a dropdown listing all stores. Selecting a different store navigates the browser to that store's domain while preserving the current path:

```typescript
window.location.href = `${protocol}//${store.domain}${window.location.pathname}`;
```

This is a full page navigation (not a client-side transition) because the store switch changes the domain, language, and all cached data.

## Adding a New Store

1. Add the store config to `libs/store-config/src/index.ts`.
2. Add a message bundle to `apps/storefront/messages/{language}.json` (or reuse an existing one).
3. Add store-specific data in the BFF mock data files (`product-data.ts`, `pricing-data.ts`, etc.) using the new store code as the key.
4. Add a Caddy route for the new domain.
5. The `getStoreData()` helper (`data/store-data.ts`) falls back to the default store's data if the new store code has no entry, so you can add data incrementally.
