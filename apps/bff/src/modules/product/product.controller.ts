import type { Product } from "@commerce/shared-types";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductDomainService } from "./product-domain.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productDomain: ProductDomainService) {}

  @Get()
  getProducts(
    @Query("q") query?: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ): Promise<Product[]> {
    return this.productDomain.getProducts({
      query,
      sortKey,
      reverse: reverse === "true",
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
