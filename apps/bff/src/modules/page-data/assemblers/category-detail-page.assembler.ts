import { Injectable } from "@nestjs/common";
import { I18nService } from "../../i18n/i18n.service";
import { PageDataService } from "../page-data.service";
import type {
  PageAssembler,
  PageAssemblyContext,
  PageAssemblyResult,
} from "./page-assembler.interface";
import {
  buildFilterGroups,
  buildSortOptions,
  getSorting,
} from "./page-assembler.utils";

@Injectable()
export class CategoryDetailPageAssembler implements PageAssembler {
  readonly routeKind = "category-detail" as const;

  constructor(
    private readonly pageData: PageDataService,
    private readonly i18n: I18nService,
  ) {}

  async assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult | null> {
    const categoryKey = ctx.route.refs.categoryKey;
    if (!categoryKey) return null;

    const { sortKey, reverse } = getSorting(ctx.query);
    const payload = await this.pageData.getCategoryPage(
      categoryKey.split("/"),
      sortKey,
      reverse,
      ctx.localeContext,
    );
    if (!payload) return null;

    const sortOptions = buildSortOptions(ctx.localeContext.locale, this.i18n);
    const { collection } = payload;
    const content =
      payload.subcollections && payload.subcollections.length > 0
        ? [
            {
              type: "category-subcollections" as const,
              breadcrumbs: payload.breadcrumbs,
              title: collection.title,
              description: collection.description,
              subcollections: payload.subcollections,
            },
          ]
        : [
            {
              type: "category-products" as const,
              breadcrumbs: payload.breadcrumbs,
              title: collection.title,
              description: collection.description,
              products: payload.products ?? [],
              sortOptions,
              filterGroups: buildFilterGroups(
                payload.products ?? [],
                ctx.localeContext.locale,
                this.i18n,
              ),
            },
          ];

    return {
      assemblerKey: "category-detail.v1",
      seo: {
        title: collection.seo?.title || collection.title,
        description:
          collection.seo?.description ||
          collection.description ||
          `${collection.title} ${this.i18n.t(ctx.localeContext.locale, "page.productsSuffix")}`,
      },
      content,
      revalidateTags: ["collections", "products"],
    };
  }
}
