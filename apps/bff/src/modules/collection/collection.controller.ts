import type { LocaleContext } from "@commerce/shared-types";
import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { COLLECTION_PORT, CollectionPort } from "../../ports/collection.port";
import { I18nService } from "../i18n/i18n.service";
import { SlugService } from "../slug/slug.service";

@Controller("collections")
export class CollectionController {
  constructor(
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
    private readonly i18n: I18nService,
    private readonly slug: SlugService,
  ) {}

  @Get()
  async getCollections(
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const collections = await this.collections.getCollections(localeContext);
    return this.slug.localizeCollections(collections, localeContext);
  }

  @Get("by-path/*")
  async getCollectionByPath(
    @Param("*") path: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const segments = path.split("/").filter(Boolean);

    // If path ends with /products, return products for that collection
    if (segments.at(-1) === "products") {
      const categoryPath = segments.slice(0, -1).join("/");
      const canonicalCategory =
        this.slug.toCanonicalCategoryKey(localeContext, categoryPath) ??
        categoryPath;
      const products = await this.collections.getCollectionProducts(
        {
          collection: canonicalCategory,
          sortKey,
          reverse: reverse === "true",
        },
        localeContext,
      );
      return this.slug.localizeProducts(products, localeContext);
    }

    const canonicalKey =
      this.slug.toCanonicalCategoryKey(localeContext, segments.join("/")) ??
      segments.join("/");
    const collection = await this.collections.getCollectionByPath(
      canonicalKey.split("/").filter(Boolean),
      localeContext,
    );

    return collection
      ? this.slug.localizeCollection(collection, localeContext)
      : undefined;
  }

  @Get(":handle/products")
  async getCollectionProducts(
    @Param("handle") handle: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const canonicalCollection =
      this.slug.toCanonicalCategoryKey(localeContext, handle) ?? handle;
    const products = await this.collections.getCollectionProducts(
      {
        collection: canonicalCollection,
        sortKey,
        reverse: reverse === "true",
      },
      localeContext,
    );
    return this.slug.localizeProducts(products, localeContext);
  }

  @Get(":handle")
  async getCollection(
    @Param("handle") handle: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const canonicalHandle =
      this.slug.toCanonicalCategoryKey(localeContext, handle) ?? handle;
    const collection = await this.collections.getCollection(
      canonicalHandle,
      localeContext,
    );
    return collection
      ? this.slug.localizeCollection(collection, localeContext)
      : undefined;
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

function normalizeLanguage(
  input?: string,
): LocaleContext["language"] | undefined {
  if (input === "en" || input === "es" || input === "nl" || input === "fr") {
    return input;
  }
  return undefined;
}
