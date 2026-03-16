import type { Image } from "@commerce/shared-types";
import type {
  CmsRawBannerGrid,
  CmsRawCmsBanner,
  CmsRawFeaturedCategory,
  CmsRawFeaturedProducts,
  CmsRawHeroBanner,
  CmsRawHomepageHero,
  CmsRawProductCarousel,
  CmsRawRichText,
  CmsRawSocialProof,
} from "../modules/page-data/blocks";

export type CmsRawBannerItem = {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image: Image;
  overlayOpacity?: number;
};

export type CmsRawUspItem = {
  icons: Image[];
};

export type CmsRawBlock =
  | CmsRawHeroBanner
  | CmsRawHomepageHero
  | CmsRawFeaturedProducts
  | CmsRawProductCarousel
  | CmsRawRichText
  | CmsRawCmsBanner
  | CmsRawBannerGrid
  | CmsRawFeaturedCategory
  | CmsRawSocialProof;

export type CmsRawPage = {
  slug: string;
  blocks: CmsRawBlock[];
};

export interface CmsPort {
  getPage(slug: string): Promise<CmsRawPage | undefined>;
}

export const CMS_PORT = Symbol("CMS_PORT");

/** Extract a single variant from the CmsRawBlock union by its type literal. */
export type CmsRawBlockOf<T extends CmsRawBlock["type"]> = Extract<
  CmsRawBlock,
  { type: T }
>;
