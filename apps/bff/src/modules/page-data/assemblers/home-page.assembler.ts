import { Injectable } from "@nestjs/common";
import { BlockOverlayService } from "../../experience/block-overlay.service";
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
    private readonly blockOverlay: BlockOverlayService,
  ) {}

  async assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult> {
    const payload = await this.pageData.getHomePage(
      ctx.localeContext,
      (rawBlocks) => this.blockOverlay.apply(rawBlocks, ctx.experience.signals),
    );

    return {
      assemblerKey: "home.v1",
      seo: {
        title: this.i18n.t(ctx.localeContext.locale, "page.homeTitle"),
        description: this.i18n.t(
          ctx.localeContext.locale,
          "page.homeDescription",
        ),
        openGraph: { type: "website" },
      },
      content: [{ type: "home", blocks: payload.blocks }],
      revalidateTags: [
        "products",
        `customer-profile:${ctx.experience.signals.customerProfile}`,
        `campaign:${ctx.experience.signals.campaignKey}`,
        ...ctx.experience.signals.activeMarketingDirectiveIds.map(
          (directiveId) => `marketing:${directiveId}`,
        ),
      ],
    };
  }
}
