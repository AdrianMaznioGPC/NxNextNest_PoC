import type { Menu } from "@commerce/shared-types";

export interface MenuPort {
  getMenu(handle: string): Promise<Menu[]>;
}

export const MENU_PORT = Symbol("MENU_PORT");
