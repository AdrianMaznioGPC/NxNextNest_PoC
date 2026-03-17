import type { SlotRenderer } from "../slot-types";
import { ContentPageNode } from "../nodes/content-page-node";

const ContentPageSlot: SlotRenderer<"page.content-page"> = (props) => {
  return <ContentPageNode node={{ type: "content-page", ...props }} />;
};

export default ContentPageSlot;
