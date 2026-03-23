import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { PAGE_PORT, PagePort } from "../../ports/page.port";
import { I18nService } from "../i18n/i18n.service";
import {
  localeContextFromQuery,
  normalizeQuery,
} from "../i18n/locale-query.utils";
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
