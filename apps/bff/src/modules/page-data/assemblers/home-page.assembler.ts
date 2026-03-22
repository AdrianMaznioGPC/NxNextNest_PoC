import type { CmsBlock, HeroBannerBlock } from "@commerce/shared-types";
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
    const blocks = applyHomeHeroOverride(payload.blocks, ctx);

    return {
      assemblerKey: "home.v1",
      seo: {
        title: this.i18n.t(ctx.localeContext.locale, "page.homeTitle"),
        description: this.i18n.t(ctx.localeContext.locale, "page.homeDescription"),
        openGraph: { type: "website" },
      },
      content: [{ type: "home", blocks }],
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

function applyHomeHeroOverride(
  blocks: CmsBlock[],
  ctx: PageAssemblyContext,
): CmsBlock[] {
  if (!ctx.experience.homeHero) {
    return blocks;
  }

  return blocks.map((block, index) => {
    if (block.type !== "hero-banner" || index !== 0) {
      return block;
    }

    const hero = block as HeroBannerBlock;
    return {
      ...hero,
      heading: ctx.experience.homeHero?.heading ?? hero.heading,
      subheading: ctx.experience.homeHero?.subheading ?? hero.subheading,
      ctaLabel: ctx.experience.homeHero?.ctaLabel ?? hero.ctaLabel,
      ctaUrl: ctx.experience.homeHero?.ctaUrl ?? hero.ctaUrl,
    };
  });
}
