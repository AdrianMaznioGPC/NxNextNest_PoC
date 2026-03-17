"use server";

import {
  BffError,
  addToCart,
  getCheckoutRedirectUrl,
  removeFromCart,
  updateCart,
} from "lib/api";
import { TAGS } from "lib/constants";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof BffError) {
    return error.response.message;
  }
  return fallback;
}

export async function addItem(
  prevState: string | null | undefined,
  selectedVariantId: string | undefined,
): Promise<string | null | undefined> {
  if (!selectedVariantId) {
    return "Missing variant selection";
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    return extractErrorMessage(e, "Error adding item to cart");
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
    return extractErrorMessage(e, "Error removing item from cart");
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
    return extractErrorMessage(e, "Error updating item quantity");
  }
}

export async function redirectToCheckout(): Promise<never> {
  const redirectUrl = await getCheckoutRedirectUrl();
  redirect(redirectUrl);
}
