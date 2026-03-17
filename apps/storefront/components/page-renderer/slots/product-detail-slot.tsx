import type { SlotRenderer } from "../slot-types";
import { ProductDetailNode } from "../nodes/product-detail-node";

const ProductDetailSlot: SlotRenderer<"page.product-detail"> = (props) => {
  return <ProductDetailNode node={{ type: "product-detail", ...props }} />;
};

export default ProductDetailSlot;
