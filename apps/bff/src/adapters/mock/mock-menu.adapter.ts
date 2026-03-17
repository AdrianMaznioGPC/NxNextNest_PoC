import { Injectable, Logger } from "@nestjs/common";
import type { LocaleContext, Menu } from "@commerce/shared-types";
import { MenuPort } from "../../ports/menu.port";
import { menus } from "./mock-data";
import {
  localizeMenu,
  telemetryCoverage,
  type LocalizationTelemetry,
} from "./mock-commerce-localization";

@Injectable()
export class MockMenuAdapter implements MenuPort {
  private readonly logger = new Logger(MockMenuAdapter.name);

  async getMenu(
    handle: string,
    localeContext?: LocaleContext,
  ): Promise<Menu[]> {
    const localized = localizeMenu(menus[handle] ?? [], localeContext);
    this.logTelemetry(localized.telemetry, { handle });
    return localized.value;
  }

  private logTelemetry(
    telemetry: LocalizationTelemetry,
    details: Record<string, unknown>,
  ) {
    const coverage = telemetryCoverage(telemetry);
    this.logger.log(
      JSON.stringify({
        metric: "commerce_localization_request_total",
        operation: "get_menu",
        entityType: "menu",
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
        operation: "get_menu",
        entityType: "menu",
        language: telemetry.language,
        coverage,
      }),
    );
    if (telemetry.fallbackCount > 0) {
      this.logger.warn(
        JSON.stringify({
          metric: "commerce_translation_fallback_total",
          operation: "get_menu",
          entityType: "menu",
          language: telemetry.language,
          fallbackCount: telemetry.fallbackCount,
          totalFields: telemetry.totalFields,
          ...details,
        }),
      );
    }
  }
}
