import type { Image } from "@commerce/shared-types";

export type CmsRawBlock =
  | {
      type: "hero-banner";
      id: string;
      heading: string;
      subheading?: string;
      ctaLabel?: string;
      ctaUrl?: string;
      image: Image;
    }
  | {
      type: "featured-products";
      id: string;
      heading: string;
      productHandles: string[];
    }
  | {
      type: "product-carousel";
      id: string;
      heading: string;
      collectionHandle: string;
    }
  | {
      type: "rich-text";
      id: string;
      html: string;
    };

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
