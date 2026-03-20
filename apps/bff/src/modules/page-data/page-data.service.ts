import type {
  CategoryListPageData,
  CategoryPageData,
  GlobalLayoutData,
  HomePageData,
  Menu,
  Page,
  ProductPageData,
  SearchPageData,
  SitemapPageData,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { MENU_PORT, type MenuPort } from "../../ports/menu.port";
import { PAGE_PORT, type PagePort } from "../../ports/page.port";
import { SEARCH_PORT, type SearchPort } from "../../ports/search.port";
import { CatalogDomainService } from "../collection/catalog-domain.service";
import { NavigationDomainService } from "../menu/navigation-domain.service";
import { ProductDomainService } from "../product/product-domain.service";
import { ContentDomainService } from "./content-domain.service";

@Injectable()
export class PageDataService {
  constructor(
    private readonly productDomain: ProductDomainService,
    private readonly catalogDomain: CatalogDomainService,
    private readonly contentDomain: ContentDomainService,
    private readonly navigationDomain: NavigationDomainService,
    @Inject(PAGE_PORT) private readonly pages: PagePort,
    @Inject(MENU_PORT) private readonly menus: MenuPort,
    @Inject(SEARCH_PORT) private readonly search: SearchPort,
  ) {}

  getLayoutData(): Promise<GlobalLayoutData> {
    return this.navigationDomain.getLayoutData();
  }

  getHomePage(): Promise<HomePageData> {
    return this.contentDomain.getHomePage();
  }

  getCategoryListPage(): Promise<CategoryListPageData> {
    return this.catalogDomain.getCategoryListPage();
  }

  getCategoryPage(
    categoryId: string,
    sort?: string,
    page?: number,
    pageSize?: number,
    filters?: Record<string, string[]>,
  ): Promise<CategoryPageData | undefined> {
    return this.catalogDomain.getCategoryPage(
      categoryId,
      sort,
      page,
      pageSize,
      filters,
    );
  }

  getProductPage(productId: string): Promise<ProductPageData | undefined> {
    return this.productDomain.getProductPage(productId);
  }

  async getSearchPage(params: {
    query?: string;
    sort?: string;
    filters?: Record<string, string[]>;
    page?: number;
    pageSize?: number;
  }): Promise<SearchPageData> {
    const result = await this.search.search(params);
    return {
      query: params.query ?? "",
      products: result.products,
      sortOptions: result.sortOptions,
      pagination: result.pagination,
      filters: result.filters,
      activeFilters: params.filters,
    };
  }

  getPages(): Promise<Page[]> {
    return this.pages.getPages();
  }

  getPage(handle: string): Promise<Page | undefined> {
    return this.pages.getPage(handle);
  }

  getMenu(handle: string): Promise<Menu[]> {
    return this.menus.getMenu(handle);
  }

  async getSitemapData(baseUrl: string): Promise<SitemapPageData> {
    const [productEntries, collectionEntries, pages] = await Promise.all([
      this.productDomain.getProductSitemapEntries(baseUrl),
      this.catalogDomain.getCollectionSitemapEntries(baseUrl),
      this.pages.getPages(),
    ]);

    const pageEntries = pages.map((page: Page) => ({
      url: `${baseUrl}/${page.handle}`,
      lastModified: page.updatedAt,
    }));

    return {
      entries: [
        { url: baseUrl, lastModified: new Date().toISOString() },
        ...productEntries,
        ...collectionEntries,
        ...pageEntries,
      ],
    };
  }
}
