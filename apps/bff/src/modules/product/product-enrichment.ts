import type {
  BaseProduct,
  Breadcrumb,
  Product,
} from "@commerce/shared-types";
import type {
  ProductAvailability,
  VariantStockInfo,
} from "../../ports/availability.port";
import type { ProductPricing } from "../../ports/pricing.port";

/**
 * Enriches a BaseProduct with pricing and availability data to produce
 * a display-ready Product. Shared by domain services and mock adapters.
 */
export function mapToProduct(
  base: BaseProduct,
  pricing: ProductPricing | undefined,
  avail: ProductAvailability | undefined,
  breadcrumbs: Breadcrumb[],
): Product {
  const variantPrices = pricing?.variantPrices ?? new Map();
  const variantAvail =
    avail?.variantAvailability ?? new Map<string, VariantStockInfo>();
  const allAmounts = [...variantPrices.values()].map((p) =>
    parseFloat(p.amount),
  );

  const hasPricing = pricing !== undefined && allAmounts.length > 0;
  const hasAvailability = avail !== undefined;

  const UNAVAILABLE_STOCK_INFO: VariantStockInfo = {
    purchasable: false,
    stockStatus: "unavailable",
    stockMessage: "Currently Unavailable",
  };

  return {
    id: base.id,
    handle: base.handle,
    title: base.title,
    description: base.description,
    descriptionHtml: base.descriptionHtml,
    options: base.options,
    featuredImage: base.featuredImage,
    images: base.images,
    seo: base.seo,
    tags: base.tags,
    updatedAt: base.updatedAt,
    purchasable: hasPricing && hasAvailability ? avail.purchasable : false,
    stockStatus:
      hasPricing && hasAvailability ? avail.stockStatus : "unavailable",
    stockMessage:
      hasPricing && hasAvailability
        ? avail.stockMessage
        : "Currently Unavailable",
    priceRange: {
      minVariantPrice: hasPricing
        ? {
            amount: Math.min(...allAmounts).toFixed(2),
            currencyCode: pricing.minVariantPrice.currencyCode,
          }
        : undefined,
      maxVariantPrice: hasPricing
        ? {
            amount: Math.max(...allAmounts).toFixed(2),
            currencyCode: pricing.maxVariantPrice.currencyCode,
          }
        : undefined,
    },
    variants: base.variants.map((v) => {
      const stock = variantAvail.get(v.id);
      const variantHasPrice = variantPrices.has(v.id);
      const variantInfo: VariantStockInfo =
        hasPricing && hasAvailability && stock
          ? {
              purchasable: stock.purchasable && variantHasPrice,
              stockStatus: variantHasPrice ? stock.stockStatus : "unavailable",
              stockMessage: variantHasPrice
                ? stock.stockMessage
                : "Currently Unavailable",
            }
          : UNAVAILABLE_STOCK_INFO;

      return {
        ...v,
        purchasable: variantInfo.purchasable,
        stockStatus: variantInfo.stockStatus,
        stockMessage: variantInfo.stockMessage,
        price: variantPrices.get(v.id),
      };
    }),
    breadcrumbs,
  };
}
