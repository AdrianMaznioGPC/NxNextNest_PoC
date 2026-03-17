"use client";

export const CART_OPEN_EVENT = "storefront:cart-open";

export function emitCartOpenEvent() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(CART_OPEN_EVENT));
}

export function subscribeCartOpenEvent(handler: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(CART_OPEN_EVENT, handler);
  return () => window.removeEventListener(CART_OPEN_EVENT, handler);
}
