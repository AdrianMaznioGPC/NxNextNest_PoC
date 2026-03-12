import { Controller, Get, Inject, Param } from "@nestjs/common";
import { PAGE_PORT, PagePort } from "../../ports/page.port";

@Controller("pages")
export class PageController {
  constructor(@Inject(PAGE_PORT) private readonly pages: PagePort) {}

  @Get()
  getPages() {
    return this.pages.getPages();
  }

  @Get(":handle")
  getPage(@Param("handle") handle: string) {
    return this.pages.getPage(handle);
  }
}
