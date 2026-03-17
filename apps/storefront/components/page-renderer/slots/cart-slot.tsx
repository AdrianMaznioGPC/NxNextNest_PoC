import { CartPageNode } from "../nodes/cart-page-node";
import type { SlotRenderer } from "../slot-types";

const CartSlot: SlotRenderer<"page.cart"> = (props) => {
  return <CartPageNode node={{ type: "cart-page", ...props }} />;
};

export default CartSlot;
