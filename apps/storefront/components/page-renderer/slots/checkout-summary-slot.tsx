"use client";

import { OrderSummary } from "components/checkout/order-summary";
import { useCheckoutSlotState } from "components/checkout/checkout-slot-state";
import type { Cart, Money } from "lib/types";

export default function CheckoutSummarySlot({
  cart,
  initialShippingCost,
}: {
  cart: Cart;
  initialShippingCost: Money;
}) {
  const state = useCheckoutSlotState();
  return <OrderSummary cart={cart} shippingCost={state.shippingCost ?? initialShippingCost} />;
}
