import { Injectable } from "@nestjs/common";
import type { Menu } from "@commerce/shared-types";
import { MenuPort } from "../../ports/menu.port";
import { menus } from "./mock-data";

@Injectable()
export class MockMenuAdapter implements MenuPort {
  async getMenu(handle: string): Promise<Menu[]> {
    return menus[handle] ?? [];
  }
}
