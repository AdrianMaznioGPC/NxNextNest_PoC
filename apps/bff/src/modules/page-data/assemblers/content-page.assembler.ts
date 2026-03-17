import { Inject, Injectable } from "@nestjs/common";
import { PAGE_PORT, PagePort } from "../../../ports/page.port";
import { SlugService } from "../../slug/slug.service";
import { buildContentPageSeo } from "./page-assembler.utils";
import type {
  PageAssembler,
  PageAssemblyContext,
  PageAssemblyResult,
} from "./page-assembler.interface";

@Injectable()
export class ContentPageAssembler implements PageAssembler {
  readonly routeKind = "content-page" as const;

  constructor(
    @Inject(PAGE_PORT) private readonly pages: PagePort,
    private readonly slug: SlugService,
  ) {}

  async assemble(
    ctx: PageAssemblyContext,
  ): Promise<PageAssemblyResult | null> {
    const pageHandle = ctx.route.refs.pageHandle;
    if (!pageHandle) return null;

    const page = await this.pages.getPage(pageHandle);
    if (!page) return null;
    const localizedPage = this.slug.localizePage(page, ctx.localeContext);

    return {
      assemblerKey: "content-page.v1",
      seo: buildContentPageSeo(localizedPage),
      content: [{ type: "content-page", page: localizedPage }],
      revalidateTags: ["pages"],
    };
  }
}

