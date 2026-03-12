import type { Collection, Product } from "@commerce/shared-types";

export interface CollectionPort {
  getCollections(): Promise<Collection[]>;

  getCollection(handle: string): Promise<Collection | undefined>;

  getCollectionByPath(slugs: string[]): Promise<Collection | undefined>;

  getCollectionProducts(params: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]>;
}

export const COLLECTION_PORT = Symbol("COLLECTION_PORT");
