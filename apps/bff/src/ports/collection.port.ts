import type {
  Collection,
  PaginationMeta,
  Product,
  SortOption,
} from "@commerce/shared-types";
import type { PaginationParams } from "./search.port";

export type CollectionProductsResult = {
  products: Product[];
  sortOptions: SortOption[];
  pagination: PaginationMeta;
};

export interface CollectionPort {
  getCollections(): Promise<Collection[]>;

  getCollection(handle: string): Promise<Collection | undefined>;

  getCollectionById(id: string): Promise<Collection | undefined>;

  getCollectionByPath(slugs: string[]): Promise<Collection | undefined>;

  getCollectionProductIds(collectionId: string): Promise<string[]>;

  getCollectionProducts(
    params: {
      collectionId: string;
      sort?: string;
    } & PaginationParams,
  ): Promise<CollectionProductsResult>;
}

export const COLLECTION_PORT = Symbol("COLLECTION_PORT");
