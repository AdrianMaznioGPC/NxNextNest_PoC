import type { CmsRawSocialProof } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

registerBlockResolver("social-proof", async (raw: CmsRawSocialProof) => ({
  type: "social-proof" as const,
  id: raw.id,
  heading: raw.heading,
  testimonials: raw.testimonials,
}));
