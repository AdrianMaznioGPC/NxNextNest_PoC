import type {
  FilterDefinition,
  ListingProduct,
  PaginationMeta,
  SortOption,
} from "@commerce/shared-types";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type SearchResult = {
  products: ListingProduct[];
  sortOptions: SortOption[];
  pagination: PaginationMeta;
  filters: FilterDefinition[];
};

export interface SearchPort {
  search(params: {
    query?: string;
    sort?: string;
    filters?: Record<string, string[]>;
    page?: number;
    pageSize?: number;
  }): Promise<SearchResult>;
}

export const SEARCH_PORT = Symbol("SEARCH_PORT");
