import type { Collection } from "@commerce/shared-types";

export interface CollectionPort {
  getCollections(): Promise<Collection[]>;

  getCollection(handle: string): Promise<Collection | undefined>;

  getCollectionById(id: string): Promise<Collection | undefined>;

  getCollectionByPath(slugs: string[]): Promise<Collection | undefined>;

  getCollectionProductIds(collection: string): Promise<string[]>;
}

export const COLLECTION_PORT = Symbol("COLLECTION_PORT");
