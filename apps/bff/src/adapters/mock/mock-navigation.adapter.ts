import type {
  FeaturedLink,
  LocaleContext,
  MegaMenuItem,
} from "@commerce/shared-types";
import { Injectable, Logger } from "@nestjs/common";
import type { NavigationPort } from "../../ports/navigation.port";
import { collections } from "./mock-data";
import {
  localizeCollections,
  localizeFeaturedLinks,
  telemetryCoverage,
  type LocalizationTelemetry,
} from "./mock-commerce-localization";

@Injectable()
export class MockNavigationAdapter implements NavigationPort {
  private readonly logger = new Logger(MockNavigationAdapter.name);

  async getMegaMenu(localeContext?: LocaleContext): Promise<MegaMenuItem[]> {
    const localizedCollections = localizeCollections(
      collections,
      localeContext,
    );
    this.logTelemetry("get_mega_menu", localizedCollections.telemetry);
    return localizedCollections.value.map((c) => ({
      title: c.title,
      path: c.path,
      image: c.image,
      children: c.subcollections?.map((sub) => ({
        title: sub.title,
        path: sub.path,
        image: sub.image,
      })),
    }));
  }

  async getFeaturedLinks(
    localeContext?: LocaleContext,
  ): Promise<FeaturedLink[]> {
    const localized = localizeFeaturedLinks(localeContext);
    this.logTelemetry("get_featured_links", localized.telemetry);
    return localized.value;
  }

  private logTelemetry(operation: string, telemetry: LocalizationTelemetry) {
    const coverage = telemetryCoverage(telemetry);
    this.logger.log(
      JSON.stringify({
        metric: "commerce_localization_request_total",
        operation,
        entityType: "navigation",
        language: telemetry.language,
        fallbackCount: 0,
        totalFields: telemetry.totalFields,
        coverage,
      }),
    );
    this.logger.log(
      JSON.stringify({
        metric: "commerce_translation_coverage_ratio",
        operation,
        entityType: "navigation",
        language: telemetry.language,
        coverage,
      }),
    );
    if (telemetry.fallbackCount > 0) {
      this.logger.warn(
        JSON.stringify({
          metric: "commerce_translation_fallback_total",
          operation,
          entityType: "navigation",
          language: telemetry.language,
          fallbackCount: telemetry.fallbackCount,
          totalFields: telemetry.totalFields,
        }),
      );
    }
  }
}
