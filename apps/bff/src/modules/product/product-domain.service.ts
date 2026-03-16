import type { Breadcrumb, Product, ProductPageData } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_PORT, type ProductPort } from "../../ports/product.port";

@Injectable()
export class ProductDomainService {
  constructor(
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
  ) {}

  getProducts(params: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]> {
    return this.products.getProducts(params);
  }

  getProduct(handle: string): Promise<Product | undefined> {
    return this.products.getProduct(handle);
  }

  getRecommendations(productId: string): Promise<Product[]> {
    return this.products.getProductRecommendations(productId);
  }

  async getProductPage(handle: string): Promise<ProductPageData | undefined> {
    const product = await this.products.getProduct(handle);
    if (!product) return undefined;

    const recommendations = await this.products.getProductRecommendations(
      product.id,
    );

    const breadcrumbs: Breadcrumb[] = [
      ...(product.breadcrumbs ?? []),
      { title: product.title, path: `/product/${product.handle}` },
    ];

    return { product, breadcrumbs, recommendations };
  }

  async getSearchResults(
    query?: string,
    sortKey?: string,
    reverse?: boolean,
  ) {
    const products = await this.products.getProducts({
      query,
      sortKey,
      reverse,
    });

    return {
      query: query ?? "",
      products,
      totalResults: products.length,
    };
  }
}
