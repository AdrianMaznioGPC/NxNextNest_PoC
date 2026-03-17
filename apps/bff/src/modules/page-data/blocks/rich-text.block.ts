import type { CmsRawRichText } from "../../../ports/cms.types";
import type { BlockResolver } from "../block-resolver-registry";

export const richTextResolver: BlockResolver<CmsRawRichText> = async (raw) => ({
  type: "rich-text" as const,
  id: raw.id,
  html: raw.html,
});
