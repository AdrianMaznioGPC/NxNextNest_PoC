import { Injectable } from "@nestjs/common";
import { I18nService } from "../../i18n/i18n.service";
import { SlugService } from "../../slug/slug.service";
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
    private readonly slug: SlugService,
  ) {}

  async assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult> {
    const payload = await this.pageData.getCategoryListPage(ctx.localeContext);
    const title = this.i18n.t(ctx.localeContext.locale, "page.allCategories");
    const homeTitle = this.i18n.t(ctx.localeContext.locale, "page.homeTitle");
    const routes = this.slug.getStaticRoutes(ctx.localeContext);
    const description = this.i18n.t(
      ctx.localeContext.locale,
      "page.allCategoriesDescription",
    );

    const breadcrumbs = [
      { title: homeTitle, path: routes.home },
      { title, path: routes.categoryList },
    ];

    return {
      assemblerKey: "category-list.v1",
      seo: {
        title,
        description,
      },
      content: [
        {
          type: "category-summary",
          breadcrumbs,
          title,
          description,
        },
        {
          type: "category-list",
          collections: payload.collections,
        },
      ],
      revalidateTags: ["collections"],
    };
  }
}
