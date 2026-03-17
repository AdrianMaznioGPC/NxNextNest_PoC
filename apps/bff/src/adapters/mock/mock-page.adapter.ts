import { Injectable, Logger } from "@nestjs/common";
import type { LocaleContext, Page } from "@commerce/shared-types";
import { PagePort } from "../../ports/page.port";
import { pages } from "./mock-data";
import {
  localizePage,
  localizePages,
  telemetryCoverage,
  type LocalizationTelemetry,
} from "./mock-commerce-localization";

@Injectable()
export class MockPageAdapter implements PagePort {
  private readonly logger = new Logger(MockPageAdapter.name);

  async getPage(
    handle: string,
    localeContext?: LocaleContext,
  ): Promise<Page | undefined> {
    const page = pages.find((candidate) => candidate.handle === handle);
    if (!page) {
      return undefined;
    }
    const localized = localizePage(page, localeContext);
    this.logTelemetry("get_page", localized.telemetry, { handle });
    return localized.value;
  }

  async getPages(localeContext?: LocaleContext): Promise<Page[]> {
    const localized = localizePages(pages, localeContext);
    this.logTelemetry("get_pages", localized.telemetry);
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
        entityType: "page",
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
        entityType: "page",
        language: telemetry.language,
        coverage,
      }),
    );
    if (telemetry.fallbackCount > 0) {
      this.logger.warn(
        JSON.stringify({
          metric: "commerce_translation_fallback_total",
          operation,
          entityType: "page",
          language: telemetry.language,
          fallbackCount: telemetry.fallbackCount,
          totalFields: telemetry.totalFields,
          ...details,
        }),
      );
    }
  }
}
