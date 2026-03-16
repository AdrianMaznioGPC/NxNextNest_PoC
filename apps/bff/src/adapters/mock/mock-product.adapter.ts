import type { BaseProduct } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { ProductPort } from "../../ports/product.port";
import { StoreContext } from "../../store";
import { productsByStore } from "./data/product-data";

@Injectable()
export class MockProductAdapter implements ProductPort {
  constructor(private readonly storeCtx: StoreContext) {}

  private get products(): BaseProduct[] {
    return productsByStore[this.storeCtx.storeCode] ?? productsByStore["fr"]!;
  }

  async getProducts(params: { query?: string }): Promise<BaseProduct[]> {
    let result = [...this.products];

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
    return this.products.find((p) => p.handle === handle);
  }

  async getProductById(id: string): Promise<BaseProduct | undefined> {
    return this.products.find((p) => p.id === id);
  }

  async getProductRecommendations(productId: string): Promise<BaseProduct[]> {
    return this.products.filter((p) => p.id !== productId).slice(0, 4);
  }
}
