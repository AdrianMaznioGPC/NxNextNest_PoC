import type { CmsRawHomepageHero } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

registerBlockResolver("homepage-hero", async (raw: CmsRawHomepageHero, ctx) => {
  const megaMenu = await ctx.navigation.getMegaMenu();

  return {
    type: "homepage-hero" as const,
    id: raw.id,
    megaMenu,
    mainBanner: raw.mainBanner,
    usps: raw.usps,
    smallBanners: raw.smallBanners,
  };
});
