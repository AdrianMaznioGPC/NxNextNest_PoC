# Shared Types (`@commerce/shared-types`)

Single source of truth for all TypeScript contracts shared between the BFF and storefront. The BFF produces these shapes; the storefront renders against them.

**Import path**: `@commerce/shared-types` (mapped in root `tsconfig.base.json`)

## Type Modules

| File                     | Key Types                                                                         |
| ------------------------ | --------------------------------------------------------------------------------- |
| `commerce.types.ts`      | `Product`, `Cart`, `Collection`, `Page`, `Money`, `Image`                         |
| `page-resolved.types.ts` | `PageBootstrapModel`, `SlotManifest`, `SlotPayloadModel`, `ExperienceRendererKey` |
| `locale.types.ts`        | `LocaleContext`, `DomainConfigModel`, `SwitchUrlRequest/Response`                 |
| `store.types.ts`         | `StoreContext`, `CartUxMode`, `MerchandisingMode`                                 |
| `checkout.types.ts`      | `CheckoutConfig`, `PlaceOrderRequest`, `OrderConfirmation`                        |
| `cms.types.ts`           | `CmsBlock` union (hero, featured products/categories, carousel, rich text)        |
| `navigation.types.ts`    | `MegaMenuItem`, `FeaturedLink`                                                    |
| `page-data.types.ts`     | `HomePageData`, `CategoryPageData`, `ProductPageData`, `GlobalLayoutData`         |
| `slot-props.types.ts`    | Checkout slot prop types                                                          |

## Detailed Reference

- [Full type documentation](../../docs/shared-types/README.md)
