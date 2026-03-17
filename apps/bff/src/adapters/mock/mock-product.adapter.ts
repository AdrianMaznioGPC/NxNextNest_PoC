import type {
  BaseProduct,
  Breadcrumb,
  Collection,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import {
  COLLECTION_PORT,
  type CollectionPort,
} from "../../ports/collection.port";
import { ProductPort } from "../../ports/product.port";
import { StoreContext } from "../../store";
import { productsByStore } from "./data/product-data";
import { getStoreData } from "./data/store-data";

@Injectable()
export class MockProductAdapter implements ProductPort {
  constructor(
    private readonly storeCtx: StoreContext,
    @Inject(COLLECTION_PORT)
    private readonly collections: CollectionPort,
  ) {}

  private get products(): BaseProduct[] {
    return getStoreData(productsByStore, this.storeCtx.storeCode);
  }

  async getProducts(params: { query?: string }): Promise<BaseProduct[]> {
    let result = [...this.products];

    if (params.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    return result;
  }

  async getProduct(handle: string): Promise<BaseProduct | undefined> {
    return this.products.find((p) => p.handle === handle);
  }

  async getProductById(id: string): Promise<BaseProduct | undefined> {
    return this.products.find((p) => p.id === id);
  }

  async getProductRecommendations(productId: string): Promise<BaseProduct[]> {
    return this.products.filter((p) => p.id !== productId).slice(0, 4);
  }

  async getProductBreadcrumbs(productId: string): Promise<Breadcrumb[]> {
    const allCollections = await this.collections.getCollections();
    const allFlat = flattenCollections(allCollections);

    // Find the most specific (deepest) collection containing this product
    let bestCollection: Collection | undefined;
    for (const col of allFlat) {
      if (col.id.startsWith("hidden-")) continue;
      const productIds = await this.collections.getCollectionProductIds(col.id);
      if (!productIds.includes(productId)) continue;
      // Prefer subcollections (have a parentId) over top-level
      if (!bestCollection || col.parentId) bestCollection = col;
    }

    if (!bestCollection) return [];

    const crumbs: Breadcrumb[] = [];
    if (bestCollection.parentId) {
      const parent = allFlat.find((c) => c.id === bestCollection.parentId);
      if (parent) crumbs.push({ title: parent.title, path: parent.path });
    }
    crumbs.push({ title: bestCollection.title, path: bestCollection.path });
    return crumbs;
  }
}

function flattenCollections(collections: Collection[]): Collection[] {
  const result: Collection[] = [];
  for (const c of collections) {
    result.push(c);
    if (c.subcollections) result.push(...c.subcollections);
  }
  return result;
}
