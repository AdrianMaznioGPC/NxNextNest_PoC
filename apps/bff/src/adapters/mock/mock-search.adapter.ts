import type {
  FilterDefinition,
  ListingProduct,
  SortOption,
} from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { SearchPort, SearchResult } from "../../ports/search.port";
import { StoreContext } from "../../store";
import { getListingIndex } from "./mock-product-index";

const DEFAULT_PAGE_SIZE = 20;

type SortDef = {
  slug: string;
  labels: Record<string, string>;
  isDefault?: boolean;
  compare: (a: ListingProduct, b: ListingProduct) => number;
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
      parseFloat(a.price?.amount ?? "0") - parseFloat(b.price?.amount ?? "0"),
  },
  {
    slug: "price-desc",
    labels: { en: "Price: High to low", fr: "Prix : d\u00e9croissant" },
    compare: (a, b) =>
      parseFloat(b.price?.amount ?? "0") - parseFloat(a.price?.amount ?? "0"),
  },
];

/**
 * Mock search adapter that reads from a pre-enriched listing index.
 * Each product variant is a separate ListingProduct.
 * Simulates how a real search backend (e.g. Elasticsearch) would work:
 * variants are indexed with pricing and availability baked in.
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
    filters?: Record<string, string[]>;
    page?: number;
    pageSize?: number;
  }): Promise<SearchResult> {
    let products = [...getListingIndex(this.storeCtx.storeCode)];

    // Filter by query
    if (params.query) {
      const q = params.query.toLowerCase();
      products = products.filter(
        (p) =>
          p.productTitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.variantTitle.toLowerCase().includes(q),
      );
    }

    // Build filters from the query-matched set (before facet filtering)
    const filters = this.buildFilters(products);

    // Apply active filters
    if (params.filters && Object.keys(params.filters).length > 0) {
      products = this.applyFilters(products, params.filters);
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
      filters,
    };
  }

  private buildFilters(products: ListingProduct[]): FilterDefinition[] {
    const filters: FilterDefinition[] = [];

    // Option-based filters (from variant selectedOptions)
    const optionMap = new Map<string, Map<string, number>>();
    for (const product of products) {
      for (const option of product.selectedOptions) {
        if (!optionMap.has(option.name)) {
          optionMap.set(option.name, new Map());
        }
        const valueCounts = optionMap.get(option.name)!;
        valueCounts.set(option.value, (valueCounts.get(option.value) ?? 0) + 1);
      }
    }

    for (const [optionName, valueCounts] of optionMap) {
      filters.push({
        key: optionName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: optionName,
        type: "checkbox",
        values: [...valueCounts.entries()].map(([value, count]) => ({
          value,
          label: value,
          count,
        })),
      });
    }

    // Stock status filter
    const isFr = this.storeCtx.locale.startsWith("fr");
    const stockCounts = new Map<string, number>();
    for (const product of products) {
      stockCounts.set(
        product.stockStatus,
        (stockCounts.get(product.stockStatus) ?? 0) + 1,
      );
    }
    if (stockCounts.size > 1) {
      const stockLabels: Record<string, string> = {
        in_stock: isFr ? "En stock" : "In Stock",
        low_stock: isFr ? "Stock faible" : "Low Stock",
        out_of_stock: isFr ? "Rupture de stock" : "Out of Stock",
        preorder: isFr ? "Pr\u00e9commande" : "Pre-order",
      };
      filters.push({
        key: "stock",
        label: isFr ? "Disponibilit\u00e9" : "Availability",
        type: "checkbox",
        values: [...stockCounts.entries()].map(([status, count]) => ({
          value: status,
          label: stockLabels[status] ?? status,
          count,
        })),
      });
    }

    return filters;
  }

  private applyFilters(
    products: ListingProduct[],
    activeFilters: Record<string, string[]>,
  ): ListingProduct[] {
    return products.filter((product) => {
      for (const [filterKey, selectedValues] of Object.entries(activeFilters)) {
        if (!selectedValues || selectedValues.length === 0) continue;

        if (filterKey === "stock") {
          if (!selectedValues.includes(product.stockStatus)) return false;
          continue;
        }

        // Match against variant selectedOptions
        const matchesOption = product.selectedOptions.some((option) => {
          const optionKey = option.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-");
          if (optionKey !== filterKey) return false;
          return selectedValues.includes(option.value);
        });
        if (!matchesOption) return false;
      }
      return true;
    });
  }
}
