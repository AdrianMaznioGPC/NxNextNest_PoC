"use server";

import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/api";
import { TAGS } from "lib/constants";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function ensureCart(): Promise<void> {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) {
    await createCartAndSetCookie();
  }
}

export async function addItem(
  prevState: string | null | undefined,
  selectedVariantId: string | undefined,
): Promise<string | null | undefined> {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await ensureCart();
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
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
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
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout(): Promise<never> {
  const cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie(): Promise<void> {
  const cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
