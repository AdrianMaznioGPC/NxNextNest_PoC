import type { CheckoutConfig } from "@commerce/shared-types";

export interface CheckoutPort {
  getCheckoutConfig(): Promise<CheckoutConfig>;
}

export const CHECKOUT_PORT = Symbol("CHECKOUT_PORT");
