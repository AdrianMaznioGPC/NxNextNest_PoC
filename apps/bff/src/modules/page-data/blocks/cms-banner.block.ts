import type { CmsRawCmsBanner } from "../../../ports/cms.types";
import type { BlockResolver } from "../block-resolver-registry";

export const cmsBannerResolver: BlockResolver<CmsRawCmsBanner> = async (
  raw,
) => ({
  type: "cms-banner" as const,
  id: raw.id,
  heading: raw.heading,
  subheading: raw.subheading,
  ctaLabel: raw.ctaLabel,
  ctaUrl: raw.ctaUrl,
  image: raw.image,
  overlayOpacity: raw.overlayOpacity,
});
