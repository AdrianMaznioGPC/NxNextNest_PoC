import { Injectable } from "@nestjs/common";
import { I18nService } from "../../i18n/i18n.service";
import { PageDataService } from "../page-data.service";
import type {
  PageAssembler,
  PageAssemblyContext,
  PageAssemblyResult,
} from "./page-assembler.interface";

@Injectable()
export class CategoryListPageAssembler implements PageAssembler {
  readonly routeKind = "category-list" as const;

  constructor(
    private readonly pageData: PageDataService,
    private readonly i18n: I18nService,
  ) {}

  async assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult> {
    const payload = await this.pageData.getCategoryListPage(ctx.localeContext);
    const title = this.i18n.t(ctx.localeContext.locale, "page.allCategories");

    return {
      assemblerKey: "category-list.v1",
      seo: {
        title,
        description: this.i18n.t(
          ctx.localeContext.locale,
          "page.allCategoriesDescription",
        ),
      },
      content: [
        {
          type: "category-list",
          title,
          collections: payload.collections,
        },
      ],
      revalidateTags: ["collections"],
    };
  }
}
