import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { PageDataService } from "./page-data.service";

@Controller("page-data")
export class PageDataController {
  constructor(private readonly pageData: PageDataService) {}

  @Get("home")
  getHomePage() {
    return this.pageData.getHomePage();
  }

  @Get("categories")
  getCategoryListPage() {
    return this.pageData.getCategoryListPage();
  }

  @Get("categories/*")
  async getCategoryPage(
    @Param("*") path: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ) {
    const slugs = path.split("/").filter(Boolean);
    const data = await this.pageData.getCategoryPage(
      slugs,
      sortKey,
      reverse === "true",
    );
    if (!data) throw new NotFoundException();
    return data;
  }

  @Get("product/:handle")
  async getProductPage(@Param("handle") handle: string) {
    const data = await this.pageData.getProductPage(handle);
    if (!data) throw new NotFoundException();
    return data;
  }

  @Get("search")
  getSearchPage(
    @Query("q") query?: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ) {
    return this.pageData.getSearchPage(query, sortKey, reverse === "true");
  }
}
