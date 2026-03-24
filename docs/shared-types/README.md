# Shared Types (`@commerce/shared-types`)

## Purpose

This library is the **single source of truth** for every TypeScript contract shared between the BFF and the storefront. When the BFF returns a `PageBootstrapModel` and the storefront renders it, both sides depend on the types defined here. Changing a type in this library changes the contract for both apps simultaneously, preventing drift.

## How It Fits in the System

```
BFF (producer)  ──emits──▶  @commerce/shared-types  ◀──renders against──  Storefront (consumer)
```

The BFF assembles page bootstrap responses, slot payloads, cart responses, and domain config using these types. The storefront destructures and renders them. Neither app defines its own version of these contracts.

## Key Files

All types are exported from a single barrel file:

- **`src/index.ts`** — re-exports everything from the modules below

### Type Modules

| File                     | What It Defines                                                                                                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `commerce.types.ts`      | Core commerce models: `Product`, `ProductVariant`, `ProductOption`, `Collection`, `Cart`, `CartItem`, `Page`, `Menu`, `Money`, `Image`, `SEO`, `Breadcrumb`                                                     |
| `page-resolved.types.ts` | Page composition models: `PageBootstrapModel`, `ResolvedPageModel`, `SlotManifest`, `SlotPayloadModel`, `SlotReference`, `PageContentNode`, `ExperienceRendererKey`, `SlotOverlayRule`, `SortOption`, `PageSeo` |
| `locale.types.ts`        | Locale and i18n models: `LocaleContext`, `LanguageCode`, `DomainConfigModel`, `DomainConfigEntry`, `SwitchUrlRequest`, `SwitchUrlResponse`, `I18nMessagesModel`                                                 |
| `store.types.ts`         | Store context: `StoreContext`, `CartUxMode`, `MerchandisingMode`, `MerchandisingSortSlug`                                                                                                                       |
| `checkout.types.ts`      | Checkout contracts: `CheckoutConfig`, `CheckoutFlowType`, `AddressFormSchema`, `DeliveryOption`, `PaymentOption`, `PlaceOrderRequest`, `OrderConfirmation`                                                      |
| `cms.types.ts`           | CMS block types: `CmsBlock` (union of `HeroBannerBlock`, `FeaturedProductsBlock`, `FeaturedCategoriesBlock`, `ProductCarouselBlock`, `RichTextBlock`)                                                           |
| `navigation.types.ts`    | Navigation models: `MegaMenuItem`, `FeaturedLink`                                                                                                                                                               |
| `page-data.types.ts`     | Page-specific data shapes: `HomePageData`, `CategoryPageData`, `ProductPageData`, `SearchPageData`, `GlobalLayoutData`                                                                                          |
| `slot-props.types.ts`    | Checkout slot props: `CheckoutHeaderSlotProps`, `CheckoutMainSlotProps`, `CheckoutSummarySlotProps`                                                                                                             |

## Key Types to Understand

### `PageBootstrapModel`

The most important type in the system. Every page request ultimately produces one of these:

```typescript
{
  page: { /* route metadata, SEO, canonical URL, alternates, cache hints */ },
  shell: {
    namespaces: string[],
    messages: Record<string, Record<string, string>>,  // i18n messages
    experience: { /* store key, theme, cart UX, merchandising mode */ }
  },
  slots: SlotManifest[]  // ordered list of renderable slot entries
}
```

### `SlotManifest`

Describes a single renderable section of the page:

- `rendererKey` + `presentation.variantKey` → which React component to use
- `dataMode: "inline" | "reference"` → whether data is embedded or fetched
- `priority: "critical" | "deferred"` → render order
- `stream: "blocking" | "deferred"` → whether to stream via Suspense

### `ExperienceRendererKey`

A string union of all allowed renderer keys (e.g., `"page.home"`, `"page.pdp-main"`, `"page.checkout-main"`). Both the BFF slot planner and the storefront renderer registry must agree on these values.

## How to Extend

1. Add or modify types in the appropriate `*.types.ts` file
2. Re-export from `src/index.ts` if adding a new file
3. Run `npm run build` (or `npx nx build shared-types`) to compile
4. Both apps will immediately see the updated contract

## Build

The library compiles to `libs/shared-types/dist/`. Both apps reference it via the TypeScript path alias `@commerce/shared-types` configured in the root `tsconfig.base.json`.
