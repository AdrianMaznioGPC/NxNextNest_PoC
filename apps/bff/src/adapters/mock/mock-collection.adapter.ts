import type { Collection } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { CollectionPort } from "../../ports/collection.port";
import { StoreContext } from "../../store";
import {
  collectionProductMap,
  collectionsByStore,
  getAllCollectionsFlat,
} from "./data/catalog-data";

@Injectable()
export class MockCollectionAdapter implements CollectionPort {
  constructor(private readonly storeCtx: StoreContext) {}

  private get collections(): Collection[] {
    return (
      collectionsByStore[this.storeCtx.storeCode] ?? collectionsByStore["fr"]!
    );
  }

  async getCollections(): Promise<Collection[]> {
    return this.collections;
  }

  async getCollection(handle: string): Promise<Collection | undefined> {
    return getAllCollectionsFlat(this.collections).find(
      (c) => c.handle === handle,
    );
  }

  async getCollectionByPath(slugs: string[]): Promise<Collection | undefined> {
    if (slugs.length === 0) return undefined;

    const top = this.collections.find((c) => c.handle === slugs[0]);
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

  async getCollectionProductIds(collection: string): Promise<string[]> {
    return collectionProductMap[collection] ?? [];
  }
}
