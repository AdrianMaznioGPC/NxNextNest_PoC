export type ProductAvailability = {
  productId: string;
  availableForSale: boolean;
  variantAvailability: Map<string, boolean>;
};

export interface AvailabilityPort {
  getAvailability(productId: string): Promise<ProductAvailability | undefined>;
  getAvailabilityBatch(
    productIds: string[],
  ): Promise<Map<string, ProductAvailability>>;
}

export const AVAILABILITY_PORT = Symbol("AVAILABILITY_PORT");
