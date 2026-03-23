import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import type { LocaleContext } from "@commerce/shared-types";
import { PAGE_PORT, PagePort } from "../../ports/page.port";
import { I18nService } from "../i18n/i18n.service";
import { SlugService } from "../slug/slug.service";

@Controller("pages")
export class PageController {
  constructor(
    @Inject(PAGE_PORT) private readonly pages: PagePort,
    private readonly i18n: I18nService,
    private readonly slug: SlugService,
  ) {}

  @Get()
  async getPages(
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const pages = await this.pages.getPages(localeContext);
    return this.slug.localizePages(pages, localeContext);
  }

  @Get(":handle")
  async getPage(
    @Param("handle") handle: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const canonicalHandle =
      this.slug.toCanonicalPageHandle(localeContext, handle) ?? handle;
    const page = await this.pages.getPage(canonicalHandle, localeContext);
    if (!page) throw new NotFoundException();
    return this.slug.localizePage(page, localeContext);
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
