import type { Product, SortOption } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { SearchPort, SearchResult } from "../../ports/search.port";
import { StoreContext } from "../../store";
import { getProductIndex } from "./mock-product-index";

const DEFAULT_PAGE_SIZE = 20;

type SortDef = {
  slug: string;
  labels: Record<string, string>;
  isDefault?: boolean;
  compare: (a: Product, b: Product) => number;
};

const SORT_DEFS: SortDef[] = [
  {
    slug: "relevance",
    labels: { en: "Relevance", fr: "Pertinence" },
    isDefault: true,
    compare: () => 0,
  },
  {
    slug: "trending-desc",
    labels: { en: "Trending", fr: "Tendances" },
    compare: () => 0,
  },
  {
    slug: "latest-desc",
    labels: { en: "Latest arrivals", fr: "Derni\u00e8res nouveaut\u00e9s" },
    compare: (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  },
  {
    slug: "price-asc",
    labels: { en: "Price: Low to high", fr: "Prix : croissant" },
    compare: (a, b) =>
      parseFloat(a.priceRange.minVariantPrice?.amount ?? "0") -
      parseFloat(b.priceRange.minVariantPrice?.amount ?? "0"),
  },
  {
    slug: "price-desc",
    labels: { en: "Price: High to low", fr: "Prix : d\u00e9croissant" },
    compare: (a, b) =>
      parseFloat(b.priceRange.minVariantPrice?.amount ?? "0") -
      parseFloat(a.priceRange.minVariantPrice?.amount ?? "0"),
  },
];

/**
 * Mock search adapter that reads from a pre-enriched product index.
 * Simulates how a real search backend (e.g. Elasticsearch) would work:
 * products are indexed with pricing and availability baked in.
 * No runtime calls to pricing or availability ports.
 */
@Injectable()
export class MockSearchAdapter implements SearchPort {
  constructor(private readonly storeCtx: StoreContext) {}

  private get language(): string {
    return this.storeCtx.locale.split("-")[0] ?? "en";
  }

  async search(params: {
    query?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
  }): Promise<SearchResult> {
    let products = [...getProductIndex(this.storeCtx.storeCode)];

    // Filter by query
    if (params.query) {
      const q = params.query.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    // Sort
    const sortDef = SORT_DEFS.find((d) => d.slug === params.sort);
    if (sortDef) {
      products = [...products].sort(sortDef.compare);
    }

    // Paginate
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
    const totalResults = products.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
    const start = (page - 1) * pageSize;
    const paginated = products.slice(start, start + pageSize);

    // Sort options with display-ready labels
    const sortOptions: SortOption[] = SORT_DEFS.map((d) => ({
      slug: d.slug,
      label: d.labels[this.language] ?? d.labels["en"]!,
      isDefault: d.isDefault,
    }));

    return {
      products: paginated,
      sortOptions,
      pagination: { page, pageSize, totalResults, totalPages },
    };
  }
}
