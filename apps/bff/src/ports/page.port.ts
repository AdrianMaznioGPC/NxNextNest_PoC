import type { LocaleContext, Page } from "@commerce/shared-types";

export interface PagePort {
  getPage(
    handle: string,
    localeContext?: LocaleContext,
  ): Promise<Page | undefined>;

  getPages(localeContext?: LocaleContext): Promise<Page[]>;
}

export const PAGE_PORT = Symbol("PAGE_PORT");
