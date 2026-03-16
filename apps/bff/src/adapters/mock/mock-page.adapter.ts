import type { Page } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { PagePort } from "../../ports/page.port";
import { pages } from "./data/content-data";

@Injectable()
export class MockPageAdapter implements PagePort {
  async getPage(handle: string): Promise<Page | undefined> {
    return pages.find((p) => p.handle === handle);
  }

  async getPages(): Promise<Page[]> {
    return pages;
  }
}
