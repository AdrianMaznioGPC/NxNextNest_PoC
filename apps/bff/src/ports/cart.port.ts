import type { Cart } from "@commerce/shared-types";

export interface CartPort {
  createCart(): Promise<Cart>;

  getCart(cartId: string): Promise<Cart | undefined>;

  addToCart(
    cartId: string,
    lines: { merchandiseId: string; quantity: number }[],
  ): Promise<Cart>;

  removeFromCart(cartId: string, lineIds: string[]): Promise<Cart>;

  updateCart(
    cartId: string,
    lines: { id: string; merchandiseId: string; quantity: number }[],
  ): Promise<Cart>;
}

export const CART_PORT = Symbol("CART_PORT");
