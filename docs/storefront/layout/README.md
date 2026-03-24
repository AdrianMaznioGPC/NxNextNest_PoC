# Storefront Layout Domain

## Purpose

Owns the global page chrome that wraps all page content: **navbar**, **footer**, **breadcrumbs**, **search UI**, **store selector modal**, and structural layout primitives. These components are rendered in the root `app/layout.tsx` and are always visible regardless of page type.

## Key Files

| File                              | Role                                                             |
| --------------------------------- | ---------------------------------------------------------------- |
| `navbar/*`                        | Top navigation bar with logo, menu, search, cart, and store flag |
| `navbar/store-selector-modal.tsx` | Region/language switching modal                                  |
| `footer.tsx`                      | Site footer with navigation links                                |
| `breadcrumbs.tsx`                 | Breadcrumb trail for category and product pages                  |
| `container.tsx`                   | Max-width content wrapper                                        |
| `search/*`                        | Search bar and search results dropdown                           |

## Store Selector Flow

1. User clicks the store flag icon in the navbar
2. Modal opens showing region and language options (from `DomainConfigModel`)
3. User selects target region + language
4. Client posts to `/api/i18n/switch` which calls BFF `POST /i18n/switch-url`
5. BFF resolves the canonical target URL for the new context
6. Client sets `pref_region` + `pref_lang` cookies and hard navigates with `window.location.assign(targetUrl)`

Hard navigation is intentional — it guarantees clean state reset across major context switches.

## Store Flag Branding

The navbar displays a store flag icon using BFF-provided metadata:

- `storeFlagIconSrc` (e.g., `/icons/spain.svg`) loaded as `<img>` from `/public/icons`
- `storeFlagIconLabel` (e.g., `Spain`) used as alt text

The storefront does **not** contain domain/country/flag mapping logic. It renders BFF values opaquely.

## Interactions

- **Root Layout**: Always renders `Navbar` and `Footer` around page children
- **BFF Layout Endpoint**: `getLayoutData()` fetches mega menu, featured links, and route paths
- **BFF Domain Config**: `getDomainConfig()` provides store selector options
- **Cart UX Context**: Navbar cart entry behaves differently based on `cartUxMode` (button vs link)
- **i18n Messages**: Uses `useT()` for all user-facing strings
