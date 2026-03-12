import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { PRODUCT_PORT, ProductPort } from "../../ports/product.port";

@Controller("products")
export class ProductController {
  constructor(
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
  ) {}

  @Get()
  getProducts(
    @Query("q") query?: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ) {
    return this.products.getProducts({
      query,
      sortKey,
      reverse: reverse === "true",
    });
  }

  @Get(":handle")
  getProduct(@Param("handle") handle: string) {
    return this.products.getProduct(handle);
  }

  @Get(":id/recommendations")
  getRecommendations(@Param("id") id: string) {
    return this.products.getProductRecommendations(id);
  }
}
