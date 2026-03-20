import type {
  Collection,
  FilterDefinition,
  ListingProduct,
  SortOption,
} from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type {
  CollectionPort,
  CollectionProductsResult,
} from "../../ports/collection.port";
import { StoreContext } from "../../store";
import {
  collectionProductMap,
  collectionsByStore,
  getAllCollectionsFlat,
} from "./data/catalog-data";
import { getStoreData } from "./data/store-data";
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
  {
    slug: "latest-desc",
    labels: { en: "Latest arrivals", fr: "Derni\u00e8res nouveaut\u00e9s" },
    compare: (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  },
];

/**
 * Mock collection adapter that reads from a pre-enriched listing index
 * for product listings. Each product variant is a separate ListingProduct.
 * Simulates how a real catalog backend would work: variants are pre-indexed
 * with pricing and availability. No runtime calls to pricing or availability ports.
 */
@Injectable()
export class MockCollectionAdapter implements CollectionPort {
  constructor(private readonly storeCtx: StoreContext) {}

  private get collections(): Collection[] {
    return getStoreData(collectionsByStore, this.storeCtx.storeCode);
  }

  async getCollections(): Promise<Collection[]> {
    return this.collections;
  }

  async getCollection(handle: string): Promise<Collection | undefined> {
    return getAllCollectionsFlat(this.collections).find(
      (c) => c.handle === handle,
    );
  }

  async getCollectionById(id: string): Promise<Collection | undefined> {
    return getAllCollectionsFlat(this.collections).find((c) => c.id === id);
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

  async getCollectionProductIds(collectionId: string): Promise<string[]> {
    return collectionProductMap[collectionId] ?? [];
  }

  async getCollectionProducts(params: {
    collectionId: string;
    sort?: string;
    filters?: Record<string, string[]>;
    page?: number;
    pageSize?: number;
  }): Promise<CollectionProductsResult> {
    const productIds = new Set(collectionProductMap[params.collectionId] ?? []);
    const index = getListingIndex(this.storeCtx.storeCode);

    // Look up pre-enriched listing products (variant-level) from the index
    let products = index.filter((p) => productIds.has(p.productId));

    // Build filters from the full (pre-filter) product set
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
    const language = this.storeCtx.locale.split("-")[0] ?? "en";
    const sortOptions: SortOption[] = SORT_DEFS.map((d) => ({
      slug: d.slug,
      label: d.labels[language] ?? d.labels["en"]!,
      isDefault: d.isDefault,
    }));

    return {
      products: paginated,
      sortOptions,
      pagination: { page, pageSize, totalResults, totalPages },
      filters,
    };
  }

  /**
   * Build filter definitions from the listing product set.
   * Generates a checkbox filter for each variant option (e.g. "Axle", "Size")
   * and one for stock status.
   */
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
    const stockCounts = new Map<string, number>();
    for (const product of products) {
      const status = product.stockStatus;
      stockCounts.set(status, (stockCounts.get(status) ?? 0) + 1);
    }
    if (stockCounts.size > 1) {
      filters.push({
        key: "stock",
        label: this.storeCtx.locale.startsWith("fr")
          ? "Disponibilit\u00e9"
          : "Availability",
        type: "checkbox",
        values: [...stockCounts.entries()].map(([status, count]) => ({
          value: status,
          label: this.formatStockLabel(status),
          count,
        })),
      });
    }

    return filters;
  }

  private formatStockLabel(status: string): string {
    const isFr = this.storeCtx.locale.startsWith("fr");
    switch (status) {
      case "in_stock":
        return isFr ? "En stock" : "In Stock";
      case "low_stock":
        return isFr ? "Stock faible" : "Low Stock";
      case "out_of_stock":
        return isFr ? "Rupture de stock" : "Out of Stock";
      case "preorder":
        return isFr ? "Pr\u00e9commande" : "Pre-order";
      default:
        return status;
    }
  }

  /**
   * Apply filter selections to listing products.
   * Each filter key maps to an option name — listing product must have
   * a matching selectedOption value to pass.
   */
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
