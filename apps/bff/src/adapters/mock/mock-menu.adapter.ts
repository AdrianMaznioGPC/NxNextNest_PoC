import type { Menu } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { MenuPort } from "../../ports/menu.port";
import { menus } from "./data/content-data";

@Injectable()
export class MockMenuAdapter implements MenuPort {
  async getMenu(handle: string): Promise<Menu[]> {
    return menus[handle] ?? [];
  }
}
