# Playbook: Run and Configure the BFF-Driven Storefront

This is a hands-on guide for developers to run the repo locally and quickly change storefront behavior through BFF configuration.

## 1) Prerequisites

1. Node.js `>=20.9.0`
2. npm (workspace install)
3. Local hosts-file access

## 2) Clone and install

```bash
git clone https://github.com/AdrianMaznioGPC/NxNextNest_PoC.git
cd NxNextNest_PoC
npm install
```

Notes:

1. Root `.npmrc` enables workspace install compatibility settings.
2. Workspaces are configured in root `package.json`.

## 3) Local domain setup

Add these entries to your hosts file:

```txt
127.0.0.1 storefront.example.com
127.0.0.1 storefront.es.example.com
127.0.0.1 storefront.nl.example.com
127.0.0.1 www.storefront.example.com
127.0.0.1 www.storefront.nl.example.com
127.0.0.1 www.storefront.es.example.com
```

`apps/storefront/next.config.ts` already includes these hosts in `allowedDevOrigins`.

## 4) Run the apps

From repo root:

```bash
# both apps
npm run dev

# or one by one
npm run dev:bff
npm run dev:storefront
```

Default local endpoints:

1. Storefront: `http://storefront.example.com:3000`
2. BFF health: `http://localhost:4000/health`

## 5) Key architecture (mental model)

1. Storefront is a thin renderer.
2. BFF decides route resolution, page composition, slots, variants, theme assignment, and store behavior.
3. BFF is authoritative for i18n negotiation, message catalogs, and formatting.
4. Storefront renders what BFF returns in `GET /page-data/bootstrap` and `GET /page-data/slot`.

### Paradigm shift (post-`next-intl`)

1. `next-intl` is removed from storefront runtime and Next config.
2. Storefront translations come from bootstrap `shell.messages` only.
3. Storefront lookup is thin key access (`useT(namespace)`), with no negotiation/pluralization business logic.
4. BFF performs interpolation and pluralization via `IntlMessageFormat`.

## 6) Where to configure behavior

## 6.1 Store/domain config (region, language defaults, theme, cart UX, branding)

File:

1. `/NxNextNest_PoC/apps/bff/src/adapters/mock/mock-data.ts`

Look for:

1. `domainConfig`
2. `domains[]`
3. `aliases[]`

Per domain you control:

1. `storeKey`
2. `regionCode`, `defaultLanguage`, `supportedLanguages`
3. `themeKey`, `themeTokenPack`, `themeRevision`
4. `experienceProfileId`
5. `cartUxMode`, `cartPath`, `openCartOnAdd`
6. `storeFlagIconSrc`, `storeFlagIconLabel`

## 6.2 Experience layer (layout + slot variant/include rules)

Files:

1. `/NxNextNest_PoC/apps/bff/src/modules/experience/experience-profile.catalog.ts`
2. `/NxNextNest_PoC/apps/bff/src/modules/experience/experience-profile.types.ts`

This controls:

1. `layoutKey`
2. Slot `variantKey`
3. Slot include/exclude and presentation metadata

## 6.3 Merchandising layer (strategy modes)

Files:

1. `/NxNextNest_PoC/apps/bff/src/modules/merchandising/merchandising-profile.catalog.ts`
2. `/NxNextNest_PoC/apps/bff/src/modules/merchandising/merchandising-profile.types.ts`

Modes:

1. `discovery`
2. `conversion`
3. `clearance`

This controls:

1. Default sort injection (only when user did not provide sort)
2. Slot variant overrides
3. Slot include/exclude overrides

## 6.4 Theme implementation (storefront-owned CSS)

Files:

1. `/NxNextNest_PoC/apps/storefront/lib/theme/token-pack-registry.ts`
2. `/NxNextNest_PoC/apps/storefront/public/theme-packs/theme-default.css`
3. `/NxNextNest_PoC/apps/storefront/public/theme-packs/theme-green.css`
4. `/NxNextNest_PoC/apps/storefront/public/theme-packs/theme-orange.css`

Rule:

1. BFF sends semantic theme identity.
2. Storefront maps identity to local CSS file.

## 6.5 Route/language/slug catalogs

File:

1. `/NxNextNest_PoC/apps/bff/src/adapters/mock/mock-data.ts`

Look for:

1. `staticRouteSegmentCatalog`
2. `productSlugCatalog`
3. `pageSlugCatalog`
4. `categorySlugCatalog`
5. `messageCatalogByLocale`

Core i18n runtime logic:

1. `/NxNextNest_PoC/apps/bff/src/modules/i18n/i18n.service.ts`
2. `/NxNextNest_PoC/apps/storefront/lib/i18n/messages-context.tsx`
3. `/NxNextNest_PoC/apps/storefront/lib/i18n/translate.ts`

## 7) Environment variables

## 7.1 Storefront env vars

Set in:

1. `/NxNextNest_PoC/apps/storefront/.env.local` (or `.env`)

Common:

1. `BFF_URL` (default `http://localhost:4000`)
2. `REVALIDATION_SECRET` (required for `/api/revalidate`)
3. `NEXT_PUBLIC_CART_API_BASE` (default `/api/cart`)
4. `NEXT_PUBLIC_CONSERVATIVE_PREFETCH` (`true` by default behavior)
5. `NEXT_PUBLIC_DEFER_SHELL_INTERACTIONS` (`true` by default behavior)
6. `DOMAIN_CONFIG_TTL_MS` (default `0` in development, `60000` otherwise)
7. `SITE_NAME` (branding text)
8. `VERCEL_PROJECT_PRODUCTION_URL` (optional production base URL)

## 7.2 BFF env vars

Set where you launch BFF (shell or process manager).

Routing/i18n:

1. `TRANSLATED_SLUGS_REDIRECT_ENABLED` (`false` unless set to `true`)

Bootstrap/slot diagnostics and load control:

1. `INCLUDE_TIMINGS_IN_RESPONSE` (`false` unless `true`)
2. `INCLUDE_LINK_LOCALIZATION_AUDIT` (`false` unless `true`)
3. `BOOTSTRAP_MAX_INFLIGHT` (default `256`)
4. `BOOTSTRAP_RETRY_AFTER_SECONDS` (default `2`)
5. `SLOT_MAX_INFLIGHT` (default `512`)
6. `SLOT_RETRY_AFTER_SECONDS` (default `2`)
7. `MAX_CRITICAL_INLINE_BYTES` (default `24576`)
8. `DEBUG_PDP_REVIEWS_DELAY_MS` (default `0`)

Cart cookie ownership:

1. `CART_COOKIE_NAME` (default `cartId`)
2. `CART_COOKIE_MAX_AGE_SECONDS` (default `2592000`)
3. `CART_COOKIE_PATH` (default `/`)
4. `CART_COOKIE_SAME_SITE` (default `Lax`)
5. `CART_COOKIE_HTTP_ONLY` (default `true`)
6. `CART_COOKIE_SECURE` (default `NODE_ENV === production`)

## 8) Verify the system from payloads

Use bootstrap as source of truth:

```bash
curl "http://localhost:4000/page-data/bootstrap?path=%2Fcategories%2Fbrakes&locale=en-US&language=en&region=US&currency=USD&market=US&domain=storefront.example.com" \
| jq '{route: .page.routeKind, status: .page.status, store: .shell.experience.storeKey, theme: .shell.experience.themeKey, mode: .shell.experience.merchandisingMode, merchProfile: .shell.experience.merchandisingProfileId, slots: [.slots[] | {rendererKey, variant: .presentation.variantKey}] }'
```

Check:

1. `shell.experience.themeKey`
2. `shell.experience.layoutKey`
3. `shell.experience.merchandisingMode`
4. Slot `presentation.variantKey`
5. `shell.messages` namespaces exist for current page shell
6. `page.translationSource` is `bff-bootstrap`

Use slot endpoint to inspect deferred payloads directly:

```bash
curl "http://localhost:4000/page-data/slot?slotId=slot:search-products&path=%2Fsearch&q=brake&locale=en-US&language=en&region=US&currency=USD&market=US&domain=storefront.example.com&variantKey=search-list-v1&layoutKey=list&density=comfortable" \
| jq '{slotId, rendererKey, presentation, staleAfterSeconds, revalidateTags, products: (.props.products | map({handle, path, title}) | .[:3])}'
```

Check:

1. `slotId` matches request.
2. `rendererKey` is correct for the slot.
3. `presentation.variantKey/layoutKey/density` are present when passed.
4. `props` contains localized, link-ready entities (for this slot: `products[].path`).

Representative response shape:

```json
{
  "slotId": "slot:search-products",
  "rendererKey": "page.search-products",
  "props": {
    "products": [
      {
        "handle": "ceramic-brake-pads",
        "path": "/product/ceramic-brake-pads",
        "title": "Ceramic Brake Pads"
      }
    ]
  },
  "presentation": {
    "variantKey": "search-list-v1",
    "layoutKey": "list",
    "density": "comfortable"
  },
  "revalidateTags": ["products", "products:lang:en"],
  "staleAfterSeconds": 60,
  "slotVersion": "2026-03-15-region-language-v1",
  "requestId": "f9a7b8c2-3f6d-4f2a-9f3d-1e2c4b8d5a19"
}
```

## 9) Fast config experiments

## 9.1 Change theme for a store

1. Edit `domainConfig.domains[]` in `/NxNextNest_PoC/apps/bff/src/adapters/mock/mock-data.ts`
2. Change:
   1. `themeKey`
   2. `themeTokenPack`
   3. bump `themeRevision`
3. Refresh storefront domain.

## 9.2 Change experience (grid/list/layout)

1. Edit `/NxNextNest_PoC/apps/bff/src/modules/experience/experience-profile.catalog.ts`
2. Change slot rule for `page.category-products`:
   1. `variantKey: "default"` (grid)
   2. `variantKey: "clp-list-v1"` (list)
3. Refresh route.

## 9.3 Change merchandising strategy

1. Edit `/NxNextNest_PoC/apps/bff/src/modules/merchandising/merchandising-profile.catalog.ts`
2. Change:
   1. `mode`
   2. `defaultSortSlug`
   3. `slotRules`
3. Refresh same URL (append `?demo=<timestamp>` if you want a cache-busting query).

## 9.4 Toggle cart UX per store

1. Edit `domainConfig.domains[].cartUxMode`:
   1. `drawer`
   2. `page`
2. Verify navbar cart entry behavior changes.

## 10) Current local store matrix

Configured in `domainConfig`:

1. `storefront.example.com` -> `store-a`, default language `en`, theme `theme-default`, cart `drawer`
2. `storefront.es.example.com` -> `store-b`, default language `es`, theme `theme-green`, cart `page`
3. `storefront.nl.example.com` -> `store-c`, default language `nl`, theme `theme-orange`, cart `page`

Supported languages across stores:

1. `en`, `es`, `nl`, `fr`

## 11) Useful QA routes

1. Home: `/`
2. Category list: `/categories` or localized segment
3. Category detail: `/categories/brakes` or localized equivalent
4. PDP: `/product/coilover-kit` or localized equivalent
5. Search: `/search?q=brake` or localized equivalent
6. Cart page (for page-mode stores): localized `cartPath`

## 12) Validation commands

```bash
npx tsc -p libs/shared-types/tsconfig.json --noEmit
npx tsc -p apps/bff/tsconfig.json --noEmit
npx tsc -p apps/storefront/tsconfig.json --noEmit
npm run i18n:runtime:guard
```

Theme/guard checks:

```bash
npm run storefront:theme:ci
```

## 13) Common pitfalls

1. If domain behavior seems stale, lower `DOMAIN_CONFIG_TTL_MS` (or keep `0` in dev).
2. If links look wrong for language prefixes, inspect bootstrap `slots[].inlineProps` and `slotRef.query` first.
3. If cart behavior mismatches expectation, verify `cartUxMode` in `domainConfig` and `shell.experience`.
4. If theme does not switch, confirm `themeTokenPack` exists in storefront registry and CSS file exists under `/public/theme-packs`.

## 14) i18n behavior checks (must pass)

1. Unprefixed URL resolves to domain default language.
2. Prefixed URL resolves to prefix language.
3. Default-language prefixed URL redirects to unprefixed canonical.
4. Browser back from prefixed page to older unprefixed page does not 404 for valid route.
5. Storefront has no `next-intl` imports (`npm run i18n:runtime:guard`).

## 15) Recommended workflow for product exploration

1. Start both apps.
2. Open two domains side by side.
3. Change one BFF config value (theme, experience, merchandising, cart UX).
4. Refresh and compare.
5. Inspect bootstrap payload to prove source-of-truth decisions.
