import type {
  Breadcrumb,
  CategoryListPageData,
  CategoryPageData,
  Collection,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { COLLECTION_PORT, type CollectionPort } from "../../ports/collection.port";

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

  getCollectionProducts(params: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
  }) {
    return this.collections.getCollectionProducts(params);
  }

  async getCategoryListPage(): Promise<CategoryListPageData> {
    const collections = await this.collections.getCollections();
    return { collections };
  }

  async getCategoryPage(
    slugs: string[],
    sortKey?: string,
    reverse?: boolean,
  ): Promise<CategoryPageData | undefined> {
    const collection = await this.collections.getCollectionByPath(slugs);
    if (!collection) return undefined;

    const breadcrumbs = await this.buildCategoryBreadcrumbs(slugs);

    const hasSubs =
      collection.subcollections && collection.subcollections.length > 0;

    if (hasSubs) {
      return {
        collection,
        breadcrumbs,
        subcollections: collection.subcollections,
      };
    }

    const collectionKey = slugs.join("/");
    const products = await this.collections.getCollectionProducts({
      collection: collectionKey,
      sortKey,
      reverse,
    });

    return { collection, breadcrumbs, products };
  }

  private async buildCategoryBreadcrumbs(
    slugs: string[],
  ): Promise<Breadcrumb[]> {
    const crumbs: Breadcrumb[] = [
      { title: "Home", path: "/" },
      { title: "Categories", path: "/categories" },
    ];

    let parent: Collection | undefined;
    for (let i = 0; i < slugs.length; i++) {
      let current: Collection | undefined;

      if (i === 0) {
        const all = await this.collections.getCollections();
        current = all.find((c) => c.handle === slugs[0]);
      } else if (parent?.subcollections) {
        current = parent.subcollections.find((c) => c.handle === slugs[i]);
      }

      if (current) {
        crumbs.push({ title: current.title, path: current.path });
        parent = current;
      }
    }

    return crumbs;
  }
}
