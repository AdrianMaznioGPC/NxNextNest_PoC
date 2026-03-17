import type { Product } from "@commerce/shared-types";
import { mapToProduct } from "../../modules/product/product-enrichment";
import type {
  MockAvailabilityRecord,
  MockVariantStockInfo,
} from "./data/availability-data";
import { availabilityByStore } from "./data/availability-data";
import { pricingByStore } from "./data/pricing-data";
import type { MockPricingRecord } from "./data/pricing-data";
import { productsByStore } from "./data/product-data";

/**
 * Pre-enriched product index keyed by store code.
 *
 * Simulates what a real search/catalog backend would have: products with
 * pricing and availability already baked in at index time. Built once at
 * module load — no runtime port calls needed.
 */
const indexByStore = new Map<string, Product[]>();

function buildIndex(storeCode: string): Product[] {
  const bases = productsByStore[storeCode] ?? [];
  const pricingRecords = pricingByStore[storeCode] ?? [];
  const availRecords = availabilityByStore[storeCode] ?? [];

  const pricingMap = new Map<string, MockPricingRecord>();
  for (const r of pricingRecords) pricingMap.set(r.productId, r);

  const availMap = new Map<string, MockAvailabilityRecord>();
  for (const r of availRecords) availMap.set(r.productId, r);

  return bases.map((base) => {
    const pricing = pricingMap.get(base.id);
    const avail = availMap.get(base.id);

    return mapToProduct(
      base,
      pricing
        ? {
            productId: base.id,
            minVariantPrice: pricing.basePrice,
            maxVariantPrice: pricing.basePrice,
            variantPrices: new Map(Object.entries(pricing.variantPrices)),
          }
        : undefined,
      avail
        ? {
            productId: base.id,
            purchasable: avail.purchasable,
            stockStatus: avail.stockStatus,
            stockMessage: avail.stockMessage,
            variantAvailability: new Map(
              Object.entries(avail.variantAvailability).map(
                ([k, v]) => [k, v as MockVariantStockInfo],
              ),
            ),
          }
        : undefined,
      [], // breadcrumbs are not part of listing data
    );
  });
}

/** Returns the pre-enriched product index for a store. Lazy-built on first access. */
export function getProductIndex(storeCode: string): Product[] {
  let index = indexByStore.get(storeCode);
  if (!index) {
    index = buildIndex(storeCode);
    indexByStore.set(storeCode, index);
  }
  return index;
}
