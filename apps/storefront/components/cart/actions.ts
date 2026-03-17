"use server";

import { addToCart, getCart, removeFromCart, updateCart } from "lib/api";
import { TAGS } from "lib/constants";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: string | null | undefined,
  selectedVariantId: string | undefined,
): Promise<string | null | undefined> {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(
  prevState: string | null | undefined,
  merchandiseId: string,
): Promise<string | null | undefined> {
  try {
    await removeFromCart([merchandiseId]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: string | null | undefined,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
): Promise<string | null | undefined> {
  try {
    await updateCart([payload]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout(): Promise<never> {
  const cart = await getCart();
  redirect(cart!.checkoutUrl);
}
