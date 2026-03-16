import type { Image } from "@commerce/shared-types";
import { registerBlockResolver } from "../block-resolver-registry";

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

registerBlockResolver("social-proof", async (raw: CmsRawSocialProof) => ({
  type: "social-proof" as const,
  id: raw.id,
  heading: raw.heading,
  testimonials: raw.testimonials,
}));
