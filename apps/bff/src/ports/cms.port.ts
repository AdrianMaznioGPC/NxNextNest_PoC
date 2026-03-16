import type { Image } from "@commerce/shared-types";

export type CmsRawHeroBanner = {
  type: "hero-banner";
  id: string;
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image: Image;
};

export type CmsRawFeaturedProducts = {
  type: "featured-products";
  id: string;
  heading: string;
  productHandles: string[];
};

export type CmsRawProductCarousel = {
  type: "product-carousel";
  id: string;
  heading: string;
  collectionHandle: string;
};

export type CmsRawRichText = {
  type: "rich-text";
  id: string;
  html: string;
};

export type CmsRawBannerItem = {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image: Image;
  overlayOpacity?: number;
};

export type CmsRawCmsBanner = {
  type: "cms-banner";
  id: string;
} & CmsRawBannerItem;

export type CmsRawBannerGrid = {
  type: "banner-grid";
  id: string;
  columns: number;
  banners: CmsRawBannerItem[];
};

export type CmsRawFeaturedCategory = {
  type: "featured-category";
  id: string;
  heading: string;
  collectionHandles: string[];
};

export type CmsRawSocialProof = {
  type: "social-proof";
  id: string;
  heading: string;
  testimonials: {
    quote: string;
    author: string;
    rating: number;
    avatar?: Image;
  }[];
};

export type CmsRawUspItem = {
  icons: Image[];
};

export type CmsRawHomepageHero = {
  type: "homepage-hero";
  id: string;
  mainBanner: CmsRawBannerItem;
  usps: CmsRawUspItem[];
  smallBanners: CmsRawBannerItem[];
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
