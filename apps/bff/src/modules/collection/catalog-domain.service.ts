import type {
  Breadcrumb,
  CategoryListPageData,
  CategoryPageData,
  Collection,
  SitemapEntry,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import {
  COLLECTION_PORT,
  type CollectionPort,
} from "../../ports/collection.port";

@Injectable()
export class CatalogDomainService {
  constructor(
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
  ) {}

  getCollections(): Promise<Collection[]> {
    return this.collections.getCollections();
  }

  getCollection(handle: string): Promise<Collection | undefined> {
    return this.collections.getCollection(handle);
  }

  getCollectionByPath(slugs: string[]): Promise<Collection | undefined> {
    return this.collections.getCollectionByPath(slugs);
  }

  async getCategoryListPage(): Promise<CategoryListPageData> {
    const collections = await this.collections.getCollections();
    return { collections };
  }

  async getCategoryPage(
    categoryId: string,
    sort?: string,
    page?: number,
    pageSize?: number,
  ): Promise<CategoryPageData | undefined> {
    const collection = await this.collections.getCollectionById(categoryId);
    if (!collection) return undefined;

    const breadcrumbs = await this.buildCategoryBreadcrumbs(collection);

    const hasSubs =
      collection.subcollections && collection.subcollections.length > 0;

    if (hasSubs) {
      return {
        collection,
        canonicalSlug: collection.handle,
        breadcrumbs,
        subcollections: collection.subcollections,
      };
    }

    const result = await this.collections.getCollectionProducts({
      collectionId: collection.id,
      sort,
      page,
      pageSize,
    });

    return {
      collection,
      canonicalSlug: collection.handle,
      breadcrumbs,
      products: result.products,
      sortOptions: result.sortOptions,
      pagination: result.pagination,
    };
  }

  /** Returns sitemap entries for all collections. */
  async getCollectionSitemapEntries(baseUrl: string): Promise<SitemapEntry[]> {
    const collections = await this.collections.getCollections();
    return collections.map((c) => ({
      url: `${baseUrl}${c.path}`,
      lastModified: c.updatedAt,
    }));
  }

  private async buildCategoryBreadcrumbs(
    target: Collection,
  ): Promise<Breadcrumb[]> {
    const crumbs: Breadcrumb[] = [];

    if (target.parentId) {
      const parent = await this.collections.getCollectionById(target.parentId);
      if (parent) {
        crumbs.push({ title: parent.title, path: parent.path });
      }
    }

    crumbs.push({ title: target.title, path: target.path });
    return crumbs;
  }
}
