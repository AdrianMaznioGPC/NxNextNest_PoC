import type {
  Collection,
  FilterDefinition,
  ListingProduct,
  PaginationMeta,
  SortOption,
} from "@commerce/shared-types";
import type { PaginationParams } from "./search.port";

export type CollectionProductsResult = {
  products: ListingProduct[];
  sortOptions: SortOption[];
  pagination: PaginationMeta;
  filters: FilterDefinition[];
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
      filters?: Record<string, string[]>;
    } & PaginationParams,
  ): Promise<CollectionProductsResult>;
}

export const COLLECTION_PORT = Symbol("COLLECTION_PORT");
