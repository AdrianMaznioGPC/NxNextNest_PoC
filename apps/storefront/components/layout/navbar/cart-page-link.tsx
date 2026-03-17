"use client";

import { useCart } from "components/cart/cart-context";
import OpenCart from "components/cart/open-cart";
import SmartLink from "components/smart-link";

export default function CartPageLink({ cartPath }: { cartPath: string }) {
  const { cart } = useCart();

  return (
    <SmartLink href={cartPath} intent="shell" aria-label="Open cart page">
      <OpenCart quantity={cart?.totalQuantity} />
    </SmartLink>
  );
}
