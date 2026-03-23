import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { PRODUCT_PORT, ProductPort } from "../../ports/product.port";
import { I18nService } from "../i18n/i18n.service";
import {
  localeContextFromQuery,
  normalizeQuery,
} from "../i18n/locale-query.utils";
import { SlugService } from "../slug/slug.service";

@Controller("products")
export class ProductController {
  constructor(
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
    private readonly i18n: I18nService,
    private readonly slug: SlugService,
  ) {}

  @Get()
  async getProducts(
    @Query("q") query?: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
    @Query() queryParams?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(queryParams)),
    );
    const result = await this.products.getProducts(
      {
        query,
        sortKey,
        reverse: reverse === "true",
      },
      localeContext,
    );
    return this.slug.localizeProducts(result, localeContext);
  }

  @Get(":handle")
  async getProduct(
    @Param("handle") handle: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const canonicalHandle =
      this.slug.toCanonicalProductHandle(localeContext, handle) ?? handle;
    const product = await this.products.getProduct(
      canonicalHandle,
      localeContext,
    );
    return product
      ? this.slug.localizeProduct(product, localeContext)
      : undefined;
  }

  @Get(":id/recommendations")
  async getRecommendations(
    @Param("id") id: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const products = await this.products.getProductRecommendations(
      id,
      localeContext,
    );
    return this.slug.localizeProducts(products, localeContext);
  }
}
