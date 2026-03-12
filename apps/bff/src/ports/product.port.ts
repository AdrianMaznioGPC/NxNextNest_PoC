import type { Product } from "@commerce/shared-types";

export interface ProductPort {
  getProducts(params: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]>;

  getProduct(handle: string): Promise<Product | undefined>;

  getProductRecommendations(productId: string): Promise<Product[]>;
}

export const PRODUCT_PORT = Symbol("PRODUCT_PORT");
