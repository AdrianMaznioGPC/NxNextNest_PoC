import type { Product } from "@commerce/shared-types";
import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import {
  SEARCH_PORT,
  type SearchPort,
  type SearchResult,
} from "../../ports/search.port";
import { ProductDomainService } from "./product-domain.service";

@Controller("products")
export class ProductController {
  constructor(
    private readonly productDomain: ProductDomainService,
    @Inject(SEARCH_PORT) private readonly search: SearchPort,
  ) {}

  @Get()
  getProducts(
    @Query("q") query?: string,
    @Query("sort") sort?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ): Promise<SearchResult> {
    return this.search.search({
      query,
      sort,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Get(":id/recommendations")
  getRecommendations(@Param("id") id: string): Promise<Product[]> {
    return this.productDomain.getRecommendations(id);
  }

  @Get(":handle")
  getProduct(@Param("handle") handle: string): Promise<Product | undefined> {
    return this.productDomain.getProduct(handle);
  }
}
