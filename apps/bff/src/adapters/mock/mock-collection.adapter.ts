import { Injectable } from "@nestjs/common";
import type { Collection, Product } from "@commerce/shared-types";
import { CollectionPort } from "../../ports/collection.port";
import { collections, collectionProductMap, products } from "./mock-data";

@Injectable()
export class MockCollectionAdapter implements CollectionPort {
  async getCollections(): Promise<Collection[]> {
    return collections;
  }

  async getCollection(handle: string): Promise<Collection | undefined> {
    return collections.find((c) => c.handle === handle);
  }

  async getCollectionProducts(params: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]> {
    const ids = collectionProductMap[params.collection];
    if (!ids) return [];

    let result = ids
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];

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
}
