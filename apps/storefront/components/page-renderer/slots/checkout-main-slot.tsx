"use client";

import { ExpressCheckout } from "components/checkout/flows/express/express-checkout";
import { MultiStepCheckout } from "components/checkout/flows/multi-step/multi-step-checkout";
import { SinglePageCheckout } from "components/checkout/flows/single-page/single-page-checkout";
import type { Cart, CheckoutConfig } from "lib/types";

type CheckoutMainSlotProps = {
  cart: Cart;
  config: CheckoutConfig;
};

export function SinglePageCheckoutMainSlot({
  cart,
  config,
}: CheckoutMainSlotProps) {
  return (
    <SinglePageCheckout cart={cart} config={config} renderSummary={false} />
  );
}

export function MultiStepCheckoutMainSlot({
  cart,
  config,
}: CheckoutMainSlotProps) {
  return (
    <MultiStepCheckout cart={cart} config={config} renderSummary={false} />
  );
}

export function ExpressCheckoutMainSlot({
  cart,
  config,
}: CheckoutMainSlotProps) {
  return <ExpressCheckout cart={cart} config={config} renderSummary={false} />;
}

export default SinglePageCheckoutMainSlot;
