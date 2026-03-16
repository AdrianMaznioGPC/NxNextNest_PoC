import type { CmsRawRichText } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

registerBlockResolver("rich-text", async (raw: CmsRawRichText) => ({
  type: "rich-text" as const,
  id: raw.id,
  html: raw.html,
}));
