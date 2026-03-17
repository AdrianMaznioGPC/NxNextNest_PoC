import type { SlotRenderer } from "../slot-types";
import { CategorySubcollectionsNode } from "../nodes/category-subcollections-node";

const CategorySubcollectionsSlot: SlotRenderer<
  "page.category-subcollections"
> = (props) => {
  return (
    <CategorySubcollectionsNode
      node={{ type: "category-subcollections", ...props }}
    />
  );
};

export default CategorySubcollectionsSlot;
