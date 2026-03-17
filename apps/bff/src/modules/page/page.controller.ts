import type { Page } from "@commerce/shared-types";
import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { PAGE_PORT, PagePort } from "../../ports/page.port";

@Controller("pages")
export class PageController {
  constructor(@Inject(PAGE_PORT) private readonly pages: PagePort) {}

  @Get()
  getPages(): Promise<Page[]> {
    return this.pages.getPages();
  }

  @Get(":handle")
  async getPage(@Param("handle") handle: string): Promise<Page> {
    const page = await this.pages.getPage(handle);
    if (!page) throw new NotFoundException();
    return page;
  }
}
