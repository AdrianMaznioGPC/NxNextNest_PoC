import type { CmsRawBannerItem } from "../../../ports/cms.port";
import { registerBlockResolver } from "../block-resolver-registry";

export type CmsRawCmsBanner = {
  type: "cms-banner";
  id: string;
} & CmsRawBannerItem;

registerBlockResolver("cms-banner", async (raw: CmsRawCmsBanner) => ({
  type: "cms-banner" as const,
  id: raw.id,
  heading: raw.heading,
  subheading: raw.subheading,
  ctaLabel: raw.ctaLabel,
  ctaUrl: raw.ctaUrl,
  image: raw.image,
  overlayOpacity: raw.overlayOpacity,
}));
