import type { SlotRenderer } from "../slot-types";
import { CategoryProductsNode } from "../nodes/category-products-node";

const CategoryProductsSlot: SlotRenderer<"page.category-products"> = (
  props,
) => {
  return (
    <CategoryProductsNode node={{ type: "category-products", ...props }} />
  );
};

export default CategoryProductsSlot;
