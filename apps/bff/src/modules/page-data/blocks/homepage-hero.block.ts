import type { CmsRawBannerItem, CmsRawUspItem } from "../../../ports/cms.port";
import { registerBlockResolver } from "../block-resolver-registry";

export type CmsRawHomepageHero = {
  type: "homepage-hero";
  id: string;
  mainBanner: CmsRawBannerItem;
  usps: CmsRawUspItem[];
  smallBanners: CmsRawBannerItem[];
};

registerBlockResolver(
  "homepage-hero",
  async (raw: CmsRawHomepageHero, ctx) => {
    const megaMenu = await ctx.navigation.getMegaMenu();

    return {
      type: "homepage-hero" as const,
      id: raw.id,
      megaMenu,
      mainBanner: raw.mainBanner,
      usps: raw.usps,
      smallBanners: raw.smallBanners,
    };
  },
);
