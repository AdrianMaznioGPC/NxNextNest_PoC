import type { CheckoutConfig } from "@commerce/shared-types";

export interface CheckoutPort {
  getCheckoutConfig(): Promise<CheckoutConfig>;

  /** Returns the URL the customer should be redirected to for checkout. */
  getCheckoutRedirectUrl(cartId: string): Promise<string>;
}

export const CHECKOUT_PORT = Symbol("CHECKOUT_PORT");
