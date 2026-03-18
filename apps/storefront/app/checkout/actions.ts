"use server";

import { createAddress, getStoreCode, placeOrder } from "lib/api";
import type { OrderConfirmation, SavedAddress } from "lib/types";

export async function saveNewAddress(
  values: Record<string, string>,
  label: string,
): Promise<SavedAddress> {
  const storeCode = await getStoreCode();
  return createAddress(storeCode, {
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
