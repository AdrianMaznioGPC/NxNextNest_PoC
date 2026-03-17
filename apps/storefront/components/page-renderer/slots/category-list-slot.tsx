import type { SlotRenderer } from "../slot-types";
import { CategoryListNode } from "../nodes/category-list-node";

const CategoryListSlot: SlotRenderer<"page.category-list"> = (props) => {
  return <CategoryListNode node={{ type: "category-list", ...props }} />;
};

export default CategoryListSlot;
