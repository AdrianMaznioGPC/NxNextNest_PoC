import type { CmsRawHeroBanner } from "../../../ports/cms.types";
import type { BlockResolver } from "../block-resolver-registry";

export const heroBannerResolver: BlockResolver<CmsRawHeroBanner> = async (
  raw,
) => ({
  type: "hero-banner" as const,
  id: raw.id,
  heading: raw.heading,
  subheading: raw.subheading,
  ctaLabel: raw.ctaLabel,
  ctaUrl: raw.ctaUrl,
  image: raw.image,
});
