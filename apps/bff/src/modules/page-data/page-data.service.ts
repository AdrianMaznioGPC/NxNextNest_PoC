import type {
  CategoryListPageData,
  CategoryPageData,
  GlobalLayoutData,
  HomePageData,
  ProductPageData,
  SearchPageData,
} from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
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
    slugs: string[],
    sortKey?: string,
    reverse?: boolean,
  ): Promise<CategoryPageData | undefined> {
    return this.catalogDomain.getCategoryPage(slugs, sortKey, reverse);
  }

  getProductPage(handle: string): Promise<ProductPageData | undefined> {
    return this.productDomain.getProductPage(handle);
  }

  getSearchPage(
    query?: string,
    sortKey?: string,
    reverse?: boolean,
  ): Promise<SearchPageData> {
    return this.productDomain.getSearchResults(query, sortKey, reverse);
  }
}
