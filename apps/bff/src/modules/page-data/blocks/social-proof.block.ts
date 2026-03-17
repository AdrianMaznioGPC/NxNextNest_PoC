import type { CmsRawSocialProof } from "../../../ports/cms.types";
import type { BlockResolver } from "../block-resolver-registry";

export const socialProofResolver: BlockResolver<CmsRawSocialProof> = async (
  raw,
) => ({
  type: "social-proof" as const,
  id: raw.id,
  heading: raw.heading,
  testimonials: raw.testimonials,
});
