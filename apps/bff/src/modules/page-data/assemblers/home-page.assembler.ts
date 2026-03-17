import { Injectable } from "@nestjs/common";
import { I18nService } from "../../i18n/i18n.service";
import { PageDataService } from "../page-data.service";
import type {
  PageAssembler,
  PageAssemblyContext,
  PageAssemblyResult,
} from "./page-assembler.interface";

@Injectable()
export class HomePageAssembler implements PageAssembler {
  readonly routeKind = "home" as const;

  constructor(
    private readonly pageData: PageDataService,
    private readonly i18n: I18nService,
  ) {}

  async assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult> {
    const payload = await this.pageData.getHomePage(ctx.localeContext);

    return {
      assemblerKey: "home.v1",
      seo: {
        title: this.i18n.t(ctx.localeContext.locale, "page.homeTitle"),
        description: this.i18n.t(ctx.localeContext.locale, "page.homeDescription"),
        openGraph: { type: "website" },
      },
      content: [{ type: "home", blocks: payload.blocks }],
      revalidateTags: ["products"],
    };
  }
}

