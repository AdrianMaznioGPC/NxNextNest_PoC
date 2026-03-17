# Mock Data Layer

## Overview

The `MockBackendModule` provides in-memory adapters for all ports. Each adapter reads from static data files in `apps/bff/src/adapters/mock/data/`. Data is keyed by store code with a fallback to the default store via `getStoreData()`.

## Data Files

| File | What It Contains |
|------|-----------------|
| `product-data.ts` | 13 `BaseProduct` records per store (auto parts: brake pads, rotors, filters, spark plugs, etc.) |
| `pricing-data.ts` | `MockPricingRecord` per product with variant-level prices in EUR |
| `availability-data.ts` | `MockAvailabilityRecord` per product with variant-level stock info |
| `catalog-data.ts` | Collection tree (5 top-level categories, some with subcategories) + product-to-collection mapping |
| `content-data.ts` | Static pages (About, Terms, Privacy, FAQ) and menu definitions (header/footer) |
| `checkout-data.ts` | Address form schemas, delivery options, payment options per store |
| `cart-data.ts` | `createEmptyCart()` factory |
| `store-data.ts` | `getStoreData()` helper for store-keyed fallback |

## Store Data Fallback

```typescript
function getStoreData<T>(map: Record<string, T>, storeCode: string): T {
  return map[storeCode] ?? map[defaultStoreCode]!;
}
```

If a store code has no entry in a data map, it falls back to the default store's data. This allows incremental data addition when adding new stores.

## Product Data Design

Products use a `record()` factory function that generates a `BaseProduct` from minimal inputs (id, handle, title, description, image ID, option name, variants). All products share the same variant ID scheme (`var-{label}-{index}`).

**Products are defined without pricing or availability.** This reflects the real architecture where these are separate services. Pricing and availability are joined at read time.

## Pre-Enriched Product Index (`mock-product-index.ts`)

For listing pages (search, collection), products need pricing and availability baked in. The `getProductIndex()` function:

1. Reads base products, pricing records, and availability records for a store.
2. Runs each through `mapToProduct()` (same enrichment function used by `ProductDomainService`).
3. Caches the result. Built lazily on first access per store.

This simulates a real search index (Elasticsearch, Algolia) where products are denormalized at index time.

**Design decision:** Listing pages use the pre-built index (no runtime port calls for pricing/availability). Individual product pages use `ProductDomainService.enrich()` with runtime port calls (for maximum freshness).

## Collection Product Mapping

`collectionProductMap` is a flat `Record<string, string[]>` mapping collection IDs to product IDs:

```typescript
{
  "cat-pads": ["p-1"],
  "cat-brakes": ["p-1", "p-2"],       // Parent includes children's products
  "cat-engine": ["p-3", "p-4"],
  "hidden-homepage-carousel": ["p-2", "p-3", "p-7", "p-11", "p-12"],
}
```

Collections prefixed with `hidden-` are internal (used for homepage carousels) and excluded from breadcrumb resolution.

## Stateful Stores

Two singleton stores persist state across requests:

- **`MockCartStore`** — `Map<string, Cart>` keyed by cart ID.
- **`MockAddressStore`** — `Map<string, SavedAddress[]>` keyed by customer ID. Seeded with two addresses for `test-customer-1`.

These are `@Injectable()` singletons (not request-scoped) so state survives across HTTP requests.

## Adapters

Each mock adapter is `@Injectable()` and implements its port interface. Most follow the same pattern:

1. Inject `StoreContext` to get the current store code.
2. Use `getStoreData()` to select store-specific data.
3. Return data or filter/search it based on parameters.

### Notable Adapter Details

- **`MockProductAdapter`** injects `CollectionPort` (via `RAW_COLLECTION_PORT`) for breadcrumb resolution. It traverses the collection tree to find the deepest collection containing the product.
- **`MockCartAdapter`** injects `ProductPort` and `PricingPort` (via `RAW_*` tokens) to look up variant details and prices when adding items.
- **`MockCheckoutAdapter`** injects `CustomerPort` (via `RAW_CUSTOMER_PORT`) to include saved addresses in the checkout config.
- **`MockCollectionAdapter`** and **`MockSearchAdapter`** both use the pre-enriched product index for listings. They independently own their sort definitions.
