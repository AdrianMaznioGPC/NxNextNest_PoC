import type { Cart } from "@commerce/shared-types";

export function createEmptyCart(currencyCode = "EUR"): Cart {
  return {
    id: `cart-${Date.now()}`,
    checkoutUrl: "/checkout",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode },
      totalAmount: { amount: "0.00", currencyCode },
      totalTaxAmount: { amount: "0.00", currencyCode },
    },
  };
}
