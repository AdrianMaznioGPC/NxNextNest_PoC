import type { Image, LocaleContext } from "@commerce/shared-types";

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

export type CmsRawBlock =
  | CmsRawHeroBanner
  | CmsRawFeaturedProducts
  | CmsRawProductCarousel
  | CmsRawRichText;

export type CmsRawPage = {
  slug: string;
  blocks: CmsRawBlock[];
};

export interface CmsPort {
  getPage(
    slug: string,
    localeContext?: LocaleContext,
  ): Promise<CmsRawPage | undefined>;
}

export const CMS_PORT = Symbol("CMS_PORT");

/** Extract a single variant from the CmsRawBlock union by its type literal. */
export type CmsRawBlockOf<T extends CmsRawBlock["type"]> = Extract<
  CmsRawBlock,
  { type: T }
>;
