import type {
  PaginationMeta,
  Product,
  SortOption,
} from "@commerce/shared-types";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type SearchResult = {
  products: Product[];
  sortOptions: SortOption[];
  pagination: PaginationMeta;
};

export interface SearchPort {
  search(params: {
    query?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
  }): Promise<SearchResult>;
}

export const SEARCH_PORT = Symbol("SEARCH_PORT");
