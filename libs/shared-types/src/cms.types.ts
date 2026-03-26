import type { Collection, Image, Product } from "./commerce.types";

export type CmsBlockBase<T extends string = string> = {
  type: T;
  id: string;
};

export type HeroBannerBlock = CmsBlockBase<"hero-banner"> & {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image: Image;
};

export type FeaturedProductsBlock = CmsBlockBase<"featured-products"> & {
  heading: string;
  products: Product[];
};

export type FeaturedCategoriesBlock = CmsBlockBase<"featured-categories"> & {
  heading: string;
  categories: Collection[];
};

export type ProductCarouselBlock = CmsBlockBase<"product-carousel"> & {
  heading: string;
  products: Product[];
};

export type RichTextBlock = CmsBlockBase<"rich-text"> & {
  html: string;
};

export type WinterEffectsBlock = CmsBlockBase<"winter-effects"> & {
  snowflakeCount?: number;
  speed?: [number, number];
  wind?: [number, number];
  radius?: [number, number];
};

export type CmsBlock =
  | HeroBannerBlock
  | FeaturedProductsBlock
  | FeaturedCategoriesBlock
  | ProductCarouselBlock
  | RichTextBlock
  | WinterEffectsBlock;
