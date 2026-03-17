import type { LocaleContext } from "@commerce/shared-types";
import { Injectable, Logger } from "@nestjs/common";
import type { CmsPort, CmsRawPage } from "../../ports/cms.port";
import {
  localizeCmsPage,
  telemetryCoverage,
  type LocalizationTelemetry,
} from "./mock-commerce-localization";

const mockPages: CmsRawPage[] = [
  {
    slug: "home",
    blocks: [
      {
        type: "hero-banner",
        id: "block-1",
        heading: "Summer Sale",
        subheading: "Up to 40% off performance parts",
        ctaLabel: "Shop Now",
        ctaUrl: "/categories",
        image: {
          url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop",
          altText: "Summer sale banner",
          width: 1200,
          height: 400,
        },
      },
      {
        type: "featured-products",
        id: "block-2",
        heading: "Top Picks",
        productHandles: [
          "ceramic-brake-pads",
          "coilover-kit",
          "cat-back-exhaust",
        ],
      },
      {
        type: "product-carousel",
        id: "block-3",
        heading: "New Arrivals",
        collectionHandle: "hidden-homepage-carousel",
      },
    ],
  },
];

@Injectable()
export class MockCmsAdapter implements CmsPort {
  private readonly logger = new Logger(MockCmsAdapter.name);

  async getPage(
    slug: string,
    localeContext?: LocaleContext,
  ): Promise<CmsRawPage | undefined> {
    const page = mockPages.find((candidate) => candidate.slug === slug);
    if (!page) {
      return undefined;
    }
    const localized = localizeCmsPage(page, localeContext);
    this.logTelemetry(localized.telemetry, { slug });
    return localized.value;
  }

  private logTelemetry(
    telemetry: LocalizationTelemetry,
    details: Record<string, unknown> = {},
  ) {
    const coverage = telemetryCoverage(telemetry);
    this.logger.log(
      JSON.stringify({
        metric: "commerce_localization_request_total",
        operation: "get_cms_page",
        entityType: "cms",
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
        operation: "get_cms_page",
        entityType: "cms",
        language: telemetry.language,
        coverage,
      }),
    );
    if (telemetry.fallbackCount > 0) {
      this.logger.warn(
        JSON.stringify({
          metric: "commerce_translation_fallback_total",
          operation: "get_cms_page",
          entityType: "cms",
          language: telemetry.language,
          fallbackCount: telemetry.fallbackCount,
          totalFields: telemetry.totalFields,
          ...details,
        }),
      );
    }
  }
}
