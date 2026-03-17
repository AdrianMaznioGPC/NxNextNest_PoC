import type { Collection, LocaleContext, Product } from "@commerce/shared-types";
import { Injectable, Logger } from "@nestjs/common";
import { CollectionPort } from "../../ports/collection.port";
import {
  collectionProductMap,
  collections,
  getAllCollectionsFlat,
  products,
} from "./mock-data";
import {
  localizeCollection,
  localizeCollections,
  localizeProducts,
  telemetryCoverage,
  type LocalizationTelemetry,
} from "./mock-commerce-localization";

@Injectable()
export class MockCollectionAdapter implements CollectionPort {
  private readonly logger = new Logger(MockCollectionAdapter.name);

  async getCollections(localeContext?: LocaleContext): Promise<Collection[]> {
    const localized = localizeCollections(collections, localeContext);
    this.logTelemetry("get_collections", localized.telemetry);
    return localized.value;
  }

  async getCollection(
    handle: string,
    localeContext?: LocaleContext,
  ): Promise<Collection | undefined> {
    const collection = getAllCollectionsFlat().find((c) => c.handle === handle);
    if (!collection) {
      return undefined;
    }
    const localized = localizeCollection(collection, localeContext);
    this.logTelemetry("get_collection", localized.telemetry, { handle });
    return localized.value;
  }

  async getCollectionByPath(
    slugs: string[],
    localeContext?: LocaleContext,
  ): Promise<Collection | undefined> {
    if (slugs.length === 0) return undefined;

    // First slug is a top-level collection
    const top = collections.find((c) => c.handle === slugs[0]);
    if (!top) return undefined;
    if (slugs.length === 1) return top;

    // Walk down the tree
    let current: Collection = top;
    for (let i = 1; i < slugs.length; i++) {
      const child = current.subcollections?.find((c) => c.handle === slugs[i]);
      if (!child) return undefined;
      current = child;
    }
    const localized = localizeCollection(current, localeContext);
    this.logTelemetry("get_collection_by_path", localized.telemetry, {
      slugs: slugs.join("/"),
    });
    return localized.value;
  }

  async getCollectionProducts(params: {
    collection: string;
    reverse?: boolean;
    sortKey?: string;
  }, localeContext?: LocaleContext): Promise<Product[]> {
    const ids = collectionProductMap[params.collection];
    if (!ids) return [];

    let result = ids
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];

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

    const localized = localizeProducts(result, localeContext);
    this.logTelemetry("get_collection_products", localized.telemetry, {
      collection: params.collection,
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
        entityType: "collection",
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
        entityType: "collection",
        language: telemetry.language,
        coverage,
      }),
    );
    if (telemetry.fallbackCount > 0) {
      this.logger.warn(
        JSON.stringify({
          metric: "commerce_translation_fallback_total",
          operation,
          entityType: "collection",
          language: telemetry.language,
          fallbackCount: telemetry.fallbackCount,
          totalFields: telemetry.totalFields,
          ...details,
        }),
      );
    }
  }
}
