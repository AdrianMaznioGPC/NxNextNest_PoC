import type { CmsRawHomepageHero } from "../../../ports/cms.types";
import type { BlockResolver } from "../block-resolver-registry";

export const homepageHeroResolver: BlockResolver<CmsRawHomepageHero> = async (
  raw,
  ctx,
) => {
  const megaMenu = await ctx.navigation.getMegaMenu();

  return {
    type: "homepage-hero" as const,
    id: raw.id,
    megaMenu,
    mainBanner: raw.mainBanner,
    usps: raw.usps,
    smallBanners: raw.smallBanners,
  };
};
