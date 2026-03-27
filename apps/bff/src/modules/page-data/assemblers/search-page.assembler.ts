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
  buildSearchSummary,
  buildSortOptions,
  getSorting,
} from "./page-assembler.utils";

@Injectable()
export class SearchPageAssembler implements PageAssembler {
  readonly routeKind = "search" as const;

  constructor(
    private readonly pageData: PageDataService,
    private readonly i18n: I18nService,
  ) {}

  async assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult> {
    const { sortKey, reverse } = getSorting(ctx.query);
    const payload = await this.pageData.getSearchPage(
      ctx.query.q,
      sortKey,
      reverse,
      ctx.localeContext,
    );
    const sortOptions = buildSortOptions(ctx.localeContext.locale, this.i18n);

    return {
      assemblerKey: "search.v1",
      seo: {
        title: this.i18n.t(ctx.localeContext.locale, "page.searchTitle"),
        description: this.i18n.t(
          ctx.localeContext.locale,
          "page.searchDescription",
        ),
      },
      content: [
        {
          type: "search-results",
          query: payload.query,
          summaryText: buildSearchSummary(
            payload.query,
            payload.totalResults,
            ctx.localeContext.locale,
            this.i18n,
          ),
          products: payload.products,
          sortOptions,
          filterGroups: buildFilterGroups(
            payload.products,
            ctx.localeContext.locale,
            this.i18n,
          ),
        },
      ],
      revalidateTags: ["products"],
    };
  }
}
