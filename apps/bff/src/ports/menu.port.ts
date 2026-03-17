import type { LocaleContext, Menu } from "@commerce/shared-types";

export interface MenuPort {
  getMenu(handle: string, localeContext?: LocaleContext): Promise<Menu[]>;
}

export const MENU_PORT = Symbol("MENU_PORT");
