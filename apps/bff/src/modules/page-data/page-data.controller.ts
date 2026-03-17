import type {
  CategoryListPageData,
  CategoryPageData,
  GlobalLayoutData,
  HomePageData,
  ProductPageData,
  SearchPageData,
} from "@commerce/shared-types";
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { PageDataService } from "./page-data.service";

@Controller("page-data")
export class PageDataController {
  constructor(private readonly pageData: PageDataService) {}

  @Get("layout")
  getLayoutData(): Promise<GlobalLayoutData> {
    return this.pageData.getLayoutData();
  }

  @Get("home")
  getHomePage(): Promise<HomePageData> {
    return this.pageData.getHomePage();
  }

  @Get("categories")
  getCategoryListPage(): Promise<CategoryListPageData> {
    return this.pageData.getCategoryListPage();
  }

  @Get("categories/:id")
  async getCategoryPage(
    @Param("id") id: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ): Promise<CategoryPageData> {
    const data = await this.pageData.getCategoryPage(
      id,
      sortKey,
      reverse === "true",
    );
    if (!data) throw new NotFoundException();
    return data;
  }

  @Get("product/:id")
  async getProductPage(@Param("id") id: string): Promise<ProductPageData> {
    const data = await this.pageData.getProductPage(id);
    if (!data) throw new NotFoundException();
    return data;
  }

  @Get("search")
  getSearchPage(
    @Query("q") query?: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ): Promise<SearchPageData> {
    return this.pageData.getSearchPage(query, sortKey, reverse === "true");
  }
}
