import type { BaseProduct } from "@commerce/shared-types";

export interface ProductPort {
  getProducts(params: { query?: string }): Promise<BaseProduct[]>;

  getProduct(handle: string): Promise<BaseProduct | undefined>;

  getProductRecommendations(productId: string): Promise<BaseProduct[]>;
}

export const PRODUCT_PORT = Symbol("PRODUCT_PORT");
