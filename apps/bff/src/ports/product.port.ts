import type { LocaleContext, Product } from "@commerce/shared-types";

export interface ProductPort {
  getProducts(params: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  }, localeContext?: LocaleContext): Promise<Product[]>;

  getProduct(
    handle: string,
    localeContext?: LocaleContext,
  ): Promise<Product | undefined>;

  getProductRecommendations(
    productId: string,
    localeContext?: LocaleContext,
  ): Promise<Product[]>;
}

export const PRODUCT_PORT = Symbol("PRODUCT_PORT");
