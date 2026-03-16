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
  ) {
    return this.productDomain.getProducts({
      query,
      sortKey,
      reverse: reverse === "true",
    });
  }

  @Get(":handle")
  getProduct(@Param("handle") handle: string) {
    return this.productDomain.getProduct(handle);
  }

  @Get(":id/recommendations")
  getRecommendations(@Param("id") id: string) {
    return this.productDomain.getRecommendations(id);
  }
}
