import { Injectable } from "@nestjs/common";
import type { Product } from "@commerce/shared-types";
import { ProductPort } from "../../ports/product.port";
import { products } from "./mock-data";

@Injectable()
export class MockProductAdapter implements ProductPort {
  async getProducts(params: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]> {
    let result = [...products];

    if (params.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (params.sortKey === "PRICE") {
      result.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount),
      );
    } else if (
      params.sortKey === "CREATED_AT" ||
      params.sortKey === "CREATED"
    ) {
      result.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
    }

    if (params.reverse) {
      result.reverse();
    }

    return result;
  }

  async getProduct(handle: string): Promise<Product | undefined> {
    return products.find((p) => p.handle === handle);
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    return products.filter((p) => p.id !== productId).slice(0, 4);
  }
}
