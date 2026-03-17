"use client";

import OpenCart from "components/cart/open-cart";
import { subscribeCartOpenEvent } from "components/cart/cart-events";
import type { CartModalProps } from "components/cart/modal";
import { useCart } from "components/cart/cart-context";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

type CartModalComponent = (props: CartModalProps) => ReactNode;

export default function DeferredCart() {
  const { cart } = useCart();
  const [CartModal, setCartModal] = useState<CartModalComponent | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const openCart = useCallback(async () => {
    if (!CartModal) {
      const mod = await import("components/cart/modal");
      setCartModal(() => mod.default as CartModalComponent);
      setModalKey(1);
      return;
    }

    setModalKey((prev) => prev + 1);
  }, [CartModal]);

  useEffect(() => subscribeCartOpenEvent(openCart), [openCart]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      {CartModal ? (
        <CartModal key={modalKey} hideTrigger={true} initialOpen={true} />
      ) : null}
    </>
  );
}
