import type { LocaleContext } from "@commerce/shared-types";
import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { MENU_PORT, MenuPort } from "../../ports/menu.port";
import { I18nService } from "../i18n/i18n.service";
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
