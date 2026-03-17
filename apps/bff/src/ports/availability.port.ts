export type VariantStockInfo = {
  purchasable: boolean;
  stockStatus: string;
  stockMessage: string;
};

export type ProductAvailability = {
  productId: string;
  purchasable: boolean;
  stockStatus: string;
  stockMessage: string;
  variantAvailability: Map<string, VariantStockInfo>;
};

export interface AvailabilityPort {
  getAvailability(productId: string): Promise<ProductAvailability | undefined>;
  getAvailabilityBatch(
    productIds: string[],
  ): Promise<Map<string, ProductAvailability>>;
}

export const AVAILABILITY_PORT = Symbol("AVAILABILITY_PORT");
