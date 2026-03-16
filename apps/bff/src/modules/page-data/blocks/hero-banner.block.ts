import type { Image } from "@commerce/shared-types";
import { registerBlockResolver } from "../block-resolver-registry";

export type CmsRawHeroBanner = {
  type: "hero-banner";
  id: string;
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image: Image;
};

registerBlockResolver("hero-banner", async (raw: CmsRawHeroBanner) => ({
  type: "hero-banner" as const,
  id: raw.id,
  heading: raw.heading,
  subheading: raw.subheading,
  ctaLabel: raw.ctaLabel,
  ctaUrl: raw.ctaUrl,
  image: raw.image,
}));
