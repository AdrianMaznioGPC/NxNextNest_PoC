import type { Page } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { PagePort } from "../../ports/page.port";
import { StoreContext } from "../../store";
import { pagesByStore } from "./data/content-data";
import { getStoreData } from "./data/store-data";

@Injectable()
export class MockPageAdapter implements PagePort {
  constructor(private readonly storeCtx: StoreContext) {}

  private get pages(): Page[] {
    return getStoreData(pagesByStore, this.storeCtx.storeCode);
  }

  async getPage(handle: string): Promise<Page | undefined> {
    return this.pages.find((p) => p.handle === handle);
  }

  async getPages(): Promise<Page[]> {
    return this.pages;
  }
}
