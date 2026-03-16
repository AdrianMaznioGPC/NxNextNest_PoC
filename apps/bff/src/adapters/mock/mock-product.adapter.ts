import type { BaseProduct } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { ProductPort } from "../../ports/product.port";
import { productRecords } from "./data/product-data";

@Injectable()
export class MockProductAdapter implements ProductPort {
  async getProducts(params: { query?: string }): Promise<BaseProduct[]> {
    let result = [...productRecords];

    if (params.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    return result;
  }

  async getProduct(handle: string): Promise<BaseProduct | undefined> {
    return productRecords.find((p) => p.handle === handle);
  }

  async getProductRecommendations(productId: string): Promise<BaseProduct[]> {
    return productRecords.filter((p) => p.id !== productId).slice(0, 4);
  }
}
