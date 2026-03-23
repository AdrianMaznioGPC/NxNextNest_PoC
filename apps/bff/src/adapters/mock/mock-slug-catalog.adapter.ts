import type { LanguageCode } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type {
  SlugCatalogPort,
  StaticRouteSegments,
} from "../../ports/slug-catalog.port";
import {
  categorySlugCatalog,
  localeByLanguage,
  pageSlugCatalog,
  productSlugCatalog,
  staticRouteSegmentCatalog,
  supportedLanguageCodes,
} from "./mock-data";

@Injectable()
export class MockSlugCatalogAdapter implements SlugCatalogPort {
  getStaticRouteSegmentCatalog(): Record<string, StaticRouteSegments> {
    return staticRouteSegmentCatalog;
  }

  getProductSlugCatalog(): Record<string, Record<string, string>> {
    return productSlugCatalog;
  }

  getPageSlugCatalog(): Record<string, Record<string, string>> {
    return pageSlugCatalog;
  }

  getCategorySlugCatalog(): Record<string, Record<string, string>> {
    return categorySlugCatalog;
  }

  getLocaleByLanguage(): Record<LanguageCode, string> {
    return { ...localeByLanguage };
  }

  getSupportedLanguageCodes(): LanguageCode[] {
    return [...supportedLanguageCodes];
  }
}
