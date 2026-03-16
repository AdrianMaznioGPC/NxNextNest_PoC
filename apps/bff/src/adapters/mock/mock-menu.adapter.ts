import type { Menu } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { MenuPort } from "../../ports/menu.port";
import { StoreContext } from "../../store";
import { menusByStore } from "./data/content-data";

@Injectable()
export class MockMenuAdapter implements MenuPort {
  constructor(private readonly storeCtx: StoreContext) {}

  async getMenu(handle: string): Promise<Menu[]> {
    const storeMenus =
      menusByStore[this.storeCtx.storeCode] ?? menusByStore["fr"]!;
    return storeMenus[handle] ?? [];
  }
}
