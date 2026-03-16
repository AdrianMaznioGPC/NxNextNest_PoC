import type { Collection, Product } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { CollectionPort } from "../../ports/collection.port";
import { PRODUCT_PORT, type ProductPort } from "../../ports/product.port";
import {
  collectionProductMap,
  collections,
  getAllCollectionsFlat,
} from "./data/catalog-data";

@Injectable()
export class MockCollectionAdapter implements CollectionPort {
  constructor(@Inject(PRODUCT_PORT) private readonly products: ProductPort) {}

  async getCollections(): Promise<Collection[]> {
    return collections;
  }

  async getCollection(handle: string): Promise<Collection | undefined> {
    return getAllCollectionsFlat().find((c) => c.handle === handle);
  }

  async getCollectionByPath(slugs: string[]): Promise<Collection | undefined> {
    if (slugs.length === 0) return undefined;

    const top = collections.find((c) => c.handle === slugs[0]);
    if (!top) return undefined;
    if (slugs.length === 1) return top;

    let current: Collection = top;
    for (let i = 1; i < slugs.length; i++) {
      const child = current.subcollections?.find((c) => c.handle === slugs[i]);
      if (!child) return undefined;
      current = child;
    }
    return current;
  }

  async getCollectionProducts(params: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]> {
    const ids = collectionProductMap[params.collection];
    if (!ids) return [];

    const allProducts = await this.products.getProducts({});
    let result = ids
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);

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
