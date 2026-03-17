import type { LocaleContext } from "@commerce/shared-types";
import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { PRODUCT_PORT, ProductPort } from "../../ports/product.port";
import { I18nService } from "../i18n/i18n.service";
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
    const result = await this.products.getProducts({
      query,
      sortKey,
      reverse: reverse === "true",
    }, localeContext);
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
    const product = await this.products.getProduct(canonicalHandle, localeContext);
    return product ? this.slug.localizeProduct(product, localeContext) : undefined;
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

function normalizeQuery(
  query: Record<string, string | string[] | undefined> = {},
): Record<string, string | undefined> {
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    normalized[key] = Array.isArray(value) ? value[0] : value;
  }
  return normalized;
}

function localeContextFromQuery(query: Record<string, string | undefined>) {
  const partial: Partial<LocaleContext> = {
    locale: query.locale,
    language: normalizeLanguage(query.language),
    region: query.region,
    currency: query.currency,
    market: query.market,
    domain: query.domain,
  };

  const hasAnyValue = Object.values(partial).some(Boolean);
  return hasAnyValue ? partial : undefined;
}

function normalizeLanguage(input?: string): LocaleContext["language"] | undefined {
  if (
    input === "en" ||
    input === "es" ||
    input === "nl" ||
    input === "fr"
  ) {
    return input;
  }
  return undefined;
}
