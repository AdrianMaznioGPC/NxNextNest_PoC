import type { BaseProduct, Breadcrumb } from "@commerce/shared-types";

export interface ProductPort {
  getProducts(params: { query?: string }): Promise<BaseProduct[]>;

  getProduct(handle: string): Promise<BaseProduct | undefined>;

  getProductById(id: string): Promise<BaseProduct | undefined>;

  getProductRecommendations(productId: string): Promise<BaseProduct[]>;

  /** Returns navigation breadcrumbs for a product's PDP. */
  getProductBreadcrumbs(productId: string): Promise<Breadcrumb[]>;
}

export const PRODUCT_PORT = Symbol("PRODUCT_PORT");
