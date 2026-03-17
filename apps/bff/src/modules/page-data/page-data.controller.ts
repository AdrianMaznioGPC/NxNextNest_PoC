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
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  SetMetadata,
} from "@nestjs/common";
import { CACHE_ROUTE_KIND_KEY } from "../system/cache-policy.service";
import { LOAD_SHED_SCOPE_KEY } from "../system/load-shedding.config";
import { PageDataService } from "./page-data.service";

@Controller("page-data")
@SetMetadata(LOAD_SHED_SCOPE_KEY, "page-data")
export class PageDataController {
  constructor(private readonly pageData: PageDataService) {}

  @Get("layout")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "layout")
  getLayoutData(): Promise<GlobalLayoutData> {
    return this.pageData.getLayoutData();
  }

  @Get("home")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "home")
  getHomePage(): Promise<HomePageData> {
    return this.pageData.getHomePage();
  }

  @Get("categories")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "category-list")
  getCategoryListPage(): Promise<CategoryListPageData> {
    return this.pageData.getCategoryListPage();
  }

  @Get("categories/:id")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "category-detail")
  async getCategoryPage(
    @Param("id") id: string,
    @Query("sort") sort?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ): Promise<CategoryPageData> {
    const data = await this.pageData.getCategoryPage(
      id,
      sort,
      page ? parseInt(page, 10) : undefined,
      pageSize ? parseInt(pageSize, 10) : undefined,
    );
    if (!data) throw new NotFoundException();
    return data;
  }

  @Get("product/:id")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "product-detail")
  async getProductPage(@Param("id") id: string): Promise<ProductPageData> {
    const data = await this.pageData.getProductPage(id);
    if (!data) throw new NotFoundException();
    return data;
  }

  @Get("search")
  @SetMetadata(LOAD_SHED_SCOPE_KEY, "search")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "search")
  getSearchPage(
    @Query("q") query?: string,
    @Query("sort") sort?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ): Promise<SearchPageData> {
    return this.pageData.getSearchPage({
      query,
      sort,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Get("pages")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "pages")
  getPages(): Promise<Page[]> {
    return this.pageData.getPages();
  }

  @Get("pages/:handle")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "pages")
  async getPage(@Param("handle") handle: string): Promise<Page> {
    const page = await this.pageData.getPage(handle);
    if (!page) throw new NotFoundException();
    return page;
  }

  @Get("menus/:handle")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "menus")
  getMenu(@Param("handle") handle: string): Promise<Menu[]> {
    return this.pageData.getMenu(handle);
  }

  @Get("sitemap")
  @SetMetadata(LOAD_SHED_SCOPE_KEY, "sitemap")
  @SetMetadata(CACHE_ROUTE_KIND_KEY, "sitemap")
  getSitemapData(@Query("baseUrl") baseUrl?: string): Promise<SitemapPageData> {
    return this.pageData.getSitemapData(baseUrl ?? "https://localhost:3000");
  }
}
