import type { SlotRenderer } from "../slot-types";
import { CategorySummaryNode } from "../nodes/category-summary-node";

const CategorySummarySlot: SlotRenderer<"page.category-summary"> = (props) => {
  return <CategorySummaryNode node={{ type: "category-summary", ...props }} />;
};

export default CategorySummarySlot;
