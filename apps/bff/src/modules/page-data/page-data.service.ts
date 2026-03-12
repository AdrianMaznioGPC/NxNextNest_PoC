import type {
  Breadcrumb,
  CategoryListPageData,
  CategoryPageData,
  Collection,
  GlobalLayoutData,
  HomePageData,
  ProductPageData,
  SearchPageData,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { CMS_PORT, CmsPort } from "../../ports/cms.port";
import { COLLECTION_PORT, CollectionPort } from "../../ports/collection.port";
import { NAVIGATION_PORT, NavigationPort } from "../../ports/navigation.port";
import { PRODUCT_PORT, ProductPort } from "../../ports/product.port";
import { resolveBlocks } from "./block-resolver-registry";
import "./block-resolvers";

@Injectable()
export class PageDataService {
  constructor(
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
    @Inject(CMS_PORT) private readonly cms: CmsPort,
    @Inject(NAVIGATION_PORT) private readonly navigation: NavigationPort,
  ) {}

  async getLayoutData(): Promise<GlobalLayoutData> {
    const [megaMenu, featuredLinks] = await Promise.all([
      this.navigation.getMegaMenu(),
      this.navigation.getFeaturedLinks(),
    ]);

    return { megaMenu, featuredLinks };
  }

  async getHomePage(): Promise<HomePageData> {
    const cmsPage = await this.cms.getPage("home");
    const rawBlocks = cmsPage?.blocks ?? [];

    const blocks = await resolveBlocks(rawBlocks, {
      products: this.products,
      collections: this.collections,
    });

    return { blocks };
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

  async getProductPage(handle: string): Promise<ProductPageData | undefined> {
    const product = await this.products.getProduct(handle);
    if (!product) return undefined;

    const recommendations = await this.products.getProductRecommendations(
      product.id,
    );

    const breadcrumbs: Breadcrumb[] = [
      ...(product.breadcrumbs ?? []),
      { title: product.title, path: `/product/${product.handle}` },
    ];

    return { product, breadcrumbs, recommendations };
  }

  async getSearchPage(
    query?: string,
    sortKey?: string,
    reverse?: boolean,
  ): Promise<SearchPageData> {
    const products = await this.products.getProducts({
      query,
      sortKey,
      reverse,
    });

    return {
      query: query ?? "",
      products,
      totalResults: products.length,
    };
  }

  private async buildCategoryBreadcrumbs(
    slugs: string[],
  ): Promise<Breadcrumb[]> {
    const crumbs: Breadcrumb[] = [
      { title: "Home", path: "/" },
      { title: "Categories", path: "/categories" },
    ];

    // Walk the tree once instead of N separate calls
    let parent: Collection | undefined;
    for (let i = 0; i < slugs.length; i++) {
      const partial = slugs.slice(0, i + 1);
      let current: Collection | undefined;

      if (i === 0) {
        // Top-level lookup
        const all = await this.collections.getCollections();
        current = all.find((c) => c.handle === slugs[0]);
      } else if (parent?.subcollections) {
        // Walk from cached parent
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
