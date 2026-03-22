import type {
  Breadcrumb,
  CategoryListPageData,
  CategoryPageData,
  Collection,
  LocaleContext,
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
import { I18nService } from "../i18n/i18n.service";
import { SlugService } from "../slug/slug.service";
import { ResilienceService } from "../system/resilience.service";
import { resolveBlocks } from "./block-resolver-registry";
import "./block-resolvers";

@Injectable()
export class PageDataService {
  constructor(
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
    @Inject(CMS_PORT) private readonly cms: CmsPort,
    @Inject(NAVIGATION_PORT) private readonly navigation: NavigationPort,
    private readonly slug: SlugService,
    private readonly i18n: I18nService,
    private readonly resilience: ResilienceService,
  ) {}

  async getLayoutData(localeContext?: LocaleContext): Promise<GlobalLayoutData> {
    const [megaMenu, featuredLinks] = await Promise.all([
      this.withReadPolicy("navigation:getMegaMenu", () =>
        this.navigation.getMegaMenu(localeContext),
      ),
      this.withReadPolicy("navigation:getFeaturedLinks", () =>
        this.navigation.getFeaturedLinks(localeContext),
      ),
    ]);

    if (!localeContext) {
      return {
        megaMenu,
        featuredLinks,
        routes: {
          home: "/",
          search: "/search",
          categoryList: "/categories",
          cart: "/cart",
          checkout: "/checkout",
        },
      };
    }

    return {
      megaMenu: this.slug.localizeMegaMenu(megaMenu, localeContext),
      featuredLinks: this.slug.localizeFeaturedLinks(featuredLinks, localeContext),
      routes: this.slug.getStaticRoutes(localeContext),
    };
  }

  async getHomePage(localeContext?: LocaleContext): Promise<HomePageData> {
    const cmsPage = await this.withReadPolicy("cms:getPage:home", () =>
      this.cms.getPage("home", localeContext),
    );
    const rawBlocks = cmsPage?.blocks ?? [];

    const blocks = await resolveBlocks(rawBlocks, {
      products: this.products,
      collections: this.collections,
      localeContext,
    });

    return {
      blocks: localeContext
        ? this.slug.localizeCmsBlocks(blocks, localeContext)
        : blocks,
    };
  }

  async getCategoryListPage(
    localeContext?: LocaleContext,
  ): Promise<CategoryListPageData> {
    const collections = await this.withReadPolicy("collections:getCollections", () =>
      this.collections.getCollections(localeContext),
    );
    return {
      collections: localeContext
        ? this.slug.localizeCollections(collections, localeContext)
        : collections,
    };
  }

  async getCategoryPage(
    slugs: string[],
    sortKey?: string,
    reverse?: boolean,
    localeContext?: LocaleContext,
  ): Promise<CategoryPageData | undefined> {
    const collection = await this.withReadPolicy(
      `collections:getCollectionByPath:${slugs.join("/")}`,
      () => this.collections.getCollectionByPath(slugs, localeContext),
    );
    if (!collection) return undefined;

    const breadcrumbs = await this.buildCategoryBreadcrumbs(slugs, localeContext);

    const hasSubs =
      collection.subcollections && collection.subcollections.length > 0;

    if (hasSubs) {
      const localizedCollection = localeContext
        ? this.slug.localizeCollection(collection, localeContext)
        : collection;
      const localizedBreadcrumbs = localeContext
        ? this.slug.localizeBreadcrumbs(breadcrumbs, localeContext)
        : breadcrumbs;
      const localizedSubs =
        localeContext && collection.subcollections
          ? this.slug.localizeCollections(collection.subcollections, localeContext)
          : collection.subcollections;

      return {
        collection: localizedCollection,
        breadcrumbs: localizedBreadcrumbs,
        subcollections: localizedSubs,
      };
    }

    const collectionKey = slugs.join("/");
    const products = await this.withReadPolicy(
      `collections:getCollectionProducts:${collectionKey}`,
      () =>
        this.collections.getCollectionProducts({
          collection: collectionKey,
          sortKey,
          reverse,
        }, localeContext),
    );

    return {
      collection: localeContext
        ? this.slug.localizeCollection(collection, localeContext)
        : collection,
      breadcrumbs: localeContext
        ? this.slug.localizeBreadcrumbs(breadcrumbs, localeContext)
        : breadcrumbs,
      products: localeContext
        ? this.slug.localizeProducts(products, localeContext)
        : products,
    };
  }

  async getProductPage(
    handle: string,
    localeContext?: LocaleContext,
  ): Promise<ProductPageData | undefined> {
    const product = await this.withReadPolicy(`products:getProduct:${handle}`, () =>
      this.products.getProduct(handle, localeContext),
    );
    if (!product) return undefined;

    const recommendations = await this.withReadPolicy(
      `products:getRecommendations:${product.id}`,
      () => this.products.getProductRecommendations(product.id, localeContext),
    );

    const breadcrumbs: Breadcrumb[] = [
      ...(product.breadcrumbs ?? []),
      {
        title: product.title,
        path: localeContext
          ? this.slug.buildProductPath(localeContext, product.handle)
          : `/product/${product.handle}`,
      },
    ];

    return {
      product: localeContext ? this.slug.localizeProduct(product, localeContext) : product,
      breadcrumbs: localeContext
        ? this.slug.localizeBreadcrumbs(breadcrumbs, localeContext)
        : breadcrumbs,
      recommendations: localeContext
        ? this.slug.localizeProducts(recommendations, localeContext)
        : recommendations,
    };
  }

  async getSearchPage(
    query?: string,
    sortKey?: string,
    reverse?: boolean,
    localeContext?: LocaleContext,
  ): Promise<SearchPageData> {
    const products = await this.withReadPolicy("products:getProducts", () =>
      this.products.getProducts({
        query,
        sortKey,
        reverse,
      }, localeContext),
    );

    return {
      query: query ?? "",
      products: localeContext
        ? this.slug.localizeProducts(products, localeContext)
        : products,
      totalResults: products.length,
    };
  }

  private async buildCategoryBreadcrumbs(
    slugs: string[],
    localeContext?: LocaleContext,
  ): Promise<Breadcrumb[]> {
    const locale = localeContext?.locale ?? "en-US";
    const crumbs: Breadcrumb[] = [
      { title: this.i18n.t(locale, "page.homeTitle"), path: "/" },
      { title: this.i18n.t(locale, "page.allCategories"), path: "/categories" },
    ];

    // Walk the tree once instead of N separate calls
    let parent: Collection | undefined;
    const allCollections = await this.withReadPolicy("collections:getCollections", () =>
      this.collections.getCollections(localeContext),
    );
    for (let i = 0; i < slugs.length; i++) {
      let current: Collection | undefined;

      if (i === 0) {
        // Top-level lookup
        current = allCollections.find((c) => c.handle === slugs[0]);
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

  private withReadPolicy<T>(key: string, task: () => Promise<T>): Promise<T> {
    return this.resilience.execute(key, task, {
      timeoutMs: 250,
      retries: 1,
      retryBackoffMs: 25,
      maxConcurrent: 128,
      circuitFailureThreshold: 5,
      circuitResetMs: 30_000,
    });
  }
}
