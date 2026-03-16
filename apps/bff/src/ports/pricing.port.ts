import type { Money } from "@commerce/shared-types";

export type ProductPricing = {
  productId: string;
  minVariantPrice: Money;
  maxVariantPrice: Money;
  variantPrices: Map<string, Money>;
};

export interface PricingPort {
  getPricing(productId: string): Promise<ProductPricing | undefined>;
  getPricingBatch(productIds: string[]): Promise<Map<string, ProductPricing>>;
}

export const PRICING_PORT = Symbol("PRICING_PORT");
