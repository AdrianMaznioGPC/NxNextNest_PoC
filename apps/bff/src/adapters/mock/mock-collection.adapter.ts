import type { Collection, Product, SortOption } from "@commerce/shared-types";
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
  {
    slug: "latest-desc",
    labels: { en: "Latest arrivals", fr: "Derni\u00e8res nouveaut\u00e9s" },
    compare: (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  },
];

/**
 * Mock collection adapter that reads from a pre-enriched product index
 * for product listings. Simulates how a real catalog backend would work:
 * products in a collection are pre-indexed with pricing and availability.
 * No runtime calls to pricing or availability ports.
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
    page?: number;
    pageSize?: number;
  }): Promise<CollectionProductsResult> {
    const productIds = new Set(collectionProductMap[params.collectionId] ?? []);
    const index = getProductIndex(this.storeCtx.storeCode);

    // Look up pre-enriched products from the index
    let products = index.filter((p) => productIds.has(p.id));

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
    };
  }
}
