import type { Collection, Product } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { CollectionPort } from "../../ports/collection.port";
import {
  collectionProductMap,
  collections,
  getAllCollectionsFlat,
  products,
} from "./mock-data";

@Injectable()
export class MockCollectionAdapter implements CollectionPort {
  async getCollections(): Promise<Collection[]> {
    return collections;
  }

  async getCollection(handle: string): Promise<Collection | undefined> {
    return getAllCollectionsFlat().find((c) => c.handle === handle);
  }

  async getCollectionByPath(slugs: string[]): Promise<Collection | undefined> {
    if (slugs.length === 0) return undefined;

    // First slug is a top-level collection
    const top = collections.find((c) => c.handle === slugs[0]);
    if (!top) return undefined;
    if (slugs.length === 1) return top;

    // Walk down the tree
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
