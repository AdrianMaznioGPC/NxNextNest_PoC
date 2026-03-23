import type { Cart, Money } from "./commerce.types";
import type { CheckoutConfig } from "./checkout.types";

export type CheckoutHeaderSlotProps = {
  title: string;
  subtitle?: string;
};

export type CheckoutMainSlotProps = {
  cart: Cart;
  config: CheckoutConfig;
};

export type CheckoutSummarySlotProps = {
  cart: Cart;
  initialShippingCost: Money;
};
