"use server";

import { createAddress, placeOrder } from "lib/api";
import type { OrderConfirmation, SavedAddress } from "lib/types";

export async function saveNewAddress(
  values: Record<string, string>,
  label: string,
): Promise<SavedAddress> {
  return createAddress({
    label,
    values,
    isDefaultShipping: false,
    isDefaultBilling: false,
  });
}

export async function placeOrderAction(request: {
  cartId: string;
  shippingAddress: Record<string, string>;
  billingAddress: Record<string, string>;
  deliveryOptionId: string;
  paymentOptionId: string;
}): Promise<OrderConfirmation> {
  return placeOrder(request);
}
