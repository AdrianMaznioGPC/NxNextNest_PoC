import type { Menu } from "@commerce/shared-types";
import { Controller, Get, Inject, Param } from "@nestjs/common";
import { MENU_PORT, MenuPort } from "../../ports/menu.port";

@Controller("menus")
export class MenuController {
  constructor(@Inject(MENU_PORT) private readonly menus: MenuPort) {}

  @Get(":handle")
  getMenu(@Param("handle") handle: string): Promise<Menu[]> {
    return this.menus.getMenu(handle);
  }
}
