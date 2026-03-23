import { Injectable, Logger } from "@nestjs/common";
import type { LocaleContext, Product } from "@commerce/shared-types";
import { ProductPort } from "../../ports/product.port";
import { products } from "./mock-data";
import {
  localizeProduct,
  localizeProducts,
  telemetryCoverage,
  type LocalizationTelemetry,
} from "./mock-commerce-localization";

@Injectable()
export class MockProductAdapter implements ProductPort {
  private readonly logger = new Logger(MockProductAdapter.name);

  async getProducts(
    params: {
      query?: string;
      reverse?: boolean;
      sortKey?: string;
    },
    localeContext?: LocaleContext,
  ): Promise<Product[]> {
    const localized = localizeProducts(products, localeContext);
    this.logTelemetry("get_products", localized.telemetry, {
      query: params.query,
    });

    let result = [...localized.value];

    if (params.query) {
      const q = params.query.toLowerCase();
      const canonicalById = new Map(
        products.map((product) => [product.id, product]),
      );
      result = result.filter((product) => {
        const canonical = canonicalById.get(product.id);
        return (
          product.title.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          canonical?.title.toLowerCase().includes(q) === true ||
          canonical?.description.toLowerCase().includes(q) === true
        );
      });
    }

    if (params.sortKey === "PRICE") {
      result.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount),
      );
    } else if (
      params.sortKey === "CREATED_AT" ||
      params.sortKey === "CREATED"
    ) {
      result.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
    }

    if (params.reverse) {
      result.reverse();
    }

    return result;
  }

  async getProduct(
    handle: string,
    localeContext?: LocaleContext,
  ): Promise<Product | undefined> {
    const product = products.find((candidate) => candidate.handle === handle);
    if (!product) {
      return undefined;
    }
    const localized = localizeProduct(product, localeContext);
    this.logTelemetry("get_product", localized.telemetry, { handle });
    return localized.value;
  }

  async getProductRecommendations(
    productId: string,
    localeContext?: LocaleContext,
  ): Promise<Product[]> {
    const recommendations = products
      .filter((p) => p.id !== productId)
      .slice(0, 4);
    const localized = localizeProducts(recommendations, localeContext);
    this.logTelemetry("get_product_recommendations", localized.telemetry, {
      productId,
    });
    return localized.value;
  }

  private logTelemetry(
    operation: string,
    telemetry: LocalizationTelemetry,
    details: Record<string, unknown> = {},
  ) {
    const coverage = telemetryCoverage(telemetry);
    this.logger.log(
      JSON.stringify({
        metric: "commerce_localization_request_total",
        operation,
        entityType: "product",
        language: telemetry.language,
        fallbackCount: 0,
        totalFields: telemetry.totalFields,
        coverage,
        ...details,
      }),
    );
    this.logger.log(
      JSON.stringify({
        metric: "commerce_translation_coverage_ratio",
        operation,
        entityType: "product",
        language: telemetry.language,
        coverage,
      }),
    );
    if (telemetry.fallbackCount > 0) {
      this.logger.warn(
        JSON.stringify({
          metric: "commerce_translation_fallback_total",
          operation,
          entityType: "product",
          language: telemetry.language,
          fallbackCount: telemetry.fallbackCount,
          totalFields: telemetry.totalFields,
          ...details,
        }),
      );
    }
  }
}
