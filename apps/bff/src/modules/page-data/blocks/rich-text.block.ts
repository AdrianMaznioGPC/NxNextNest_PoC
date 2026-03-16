import { registerBlockResolver } from "../block-resolver-registry";

export type CmsRawRichText = {
  type: "rich-text";
  id: string;
  html: string;
};

registerBlockResolver("rich-text", async (raw: CmsRawRichText) => ({
  type: "rich-text" as const,
  id: raw.id,
  html: raw.html,
}));
