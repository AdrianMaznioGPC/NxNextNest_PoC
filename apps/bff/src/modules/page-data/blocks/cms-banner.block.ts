import type { CmsRawCmsBanner } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

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
