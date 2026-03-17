import type { Cart } from "lib/types";

const CART_API_BASE = process.env.NEXT_PUBLIC_CART_API_BASE || "/api/cart";

export async function ensureCartClient() {
  return cartApiFetch("/current", {
    method: "POST",
  });
}

export async function addToCartClient(
  merchandiseId: string,
  quantity: number,
) {
  return cartApiFetch("/current/lines", {
    method: "POST",
    body: JSON.stringify({
      lines: [{ merchandiseId, quantity }],
    }),
  });
}

export async function updateCartClient(
  merchandiseId: string,
  quantity: number,
) {
  return cartApiFetch("/current/lines", {
    method: "PATCH",
    body: JSON.stringify({
      lines: [{ merchandiseId, quantity }],
    }),
  });
}

export async function removeFromCartClient(merchandiseId: string) {
  return cartApiFetch("/current/lines", {
    method: "DELETE",
    body: JSON.stringify({
      merchandiseIds: [merchandiseId],
    }),
  });
}

async function cartApiFetch(path: string, options: RequestInit): Promise<Cart | undefined> {
  const response = await fetch(`${CART_API_BASE}${path}`, {
    ...options,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Cart API error: ${response.status} ${response.statusText}`);
  }
  if (response.status === 204) {
    return undefined;
  }
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  return JSON.parse(text) as Cart;
}
