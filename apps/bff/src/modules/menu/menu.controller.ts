import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { MENU_PORT, MenuPort } from "../../ports/menu.port";
import { I18nService } from "../i18n/i18n.service";
import {
  localeContextFromQuery,
  normalizeQuery,
} from "../i18n/locale-query.utils";
import { SlugService } from "../slug/slug.service";

@Controller("menus")
export class MenuController {
  constructor(
    @Inject(MENU_PORT) private readonly menus: MenuPort,
    private readonly i18n: I18nService,
    private readonly slug: SlugService,
  ) {}

  @Get(":handle")
  async getMenu(
    @Param("handle") handle: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const menu = await this.menus.getMenu(handle, localeContext);
    return this.slug.localizeMenu(menu, localeContext);
  }
}
