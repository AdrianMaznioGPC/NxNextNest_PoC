import { Injectable } from "@nestjs/common";
import type { Cart, CartItem } from "@commerce/shared-types";
import { CartPort } from "../../ports/cart.port";
import { createEmptyCart, products } from "./mock-data";

@Injectable()
export class MockCartAdapter implements CartPort {
  private carts = new Map<string, Cart>();

  async createCart(): Promise<Cart> {
    const cart = createEmptyCart();
    this.carts.set(cart.id!, cart);
    return cart;
  }

  async getCart(cartId: string): Promise<Cart | undefined> {
    return this.carts.get(cartId);
  }

  async addToCart(
    cartId: string,
    lines: { merchandiseId: string; quantity: number }[],
  ): Promise<Cart> {
    const cart = this.carts.get(cartId) ?? createEmptyCart();

    for (const line of lines) {
      const existing = cart.lines.find(
        (l) => l.merchandise.id === line.merchandiseId,
      );

      if (existing) {
        const unitPrice =
          parseFloat(existing.cost.totalAmount.amount) / existing.quantity;
        existing.quantity += line.quantity;
        existing.cost.totalAmount.amount = (
          unitPrice * existing.quantity
        ).toFixed(2);
      } else {
        const match = products
          .flatMap((p) => p.variants.map((v) => ({ variant: v, product: p })))
          .find((pv) => pv.variant.id === line.merchandiseId);

        if (match) {
          const newItem: CartItem = {
            id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            quantity: line.quantity,
            cost: {
              totalAmount: {
                amount: (
                  parseFloat(match.variant.price.amount) * line.quantity
                ).toFixed(2),
                currencyCode: match.variant.price.currencyCode,
              },
            },
            merchandise: {
              id: match.variant.id,
              title: match.variant.title,
              selectedOptions: match.variant.selectedOptions,
              product: {
                id: match.product.id,
                handle: match.product.handle,
                path: match.product.path,
                title: match.product.title,
                featuredImage: match.product.featuredImage,
              },
            },
          };
          cart.lines.push(newItem);
        }
      }
    }

    this.recalculate(cart);
    this.carts.set(cartId, cart);
    return cart;
  }

  async removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
    const cart = this.carts.get(cartId) ?? createEmptyCart();
    cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id!));
    this.recalculate(cart);
    this.carts.set(cartId, cart);
    return cart;
  }

  async updateCart(
    cartId: string,
    lines: { id: string; merchandiseId: string; quantity: number }[],
  ): Promise<Cart> {
    const cart = this.carts.get(cartId) ?? createEmptyCart();

    for (const line of lines) {
      const existing = cart.lines.find((l) => l.id === line.id);
      if (existing) {
        const unitPrice =
          parseFloat(existing.cost.totalAmount.amount) / existing.quantity;
        existing.quantity = line.quantity;
        existing.cost.totalAmount.amount = (
          unitPrice * line.quantity
        ).toFixed(2);
      }
    }

    cart.lines = cart.lines.filter((l) => l.quantity > 0);
    this.recalculate(cart);
    this.carts.set(cartId, cart);
    return cart;
  }

  private recalculate(cart: Cart): void {
    cart.totalQuantity = cart.lines.reduce((sum, l) => sum + l.quantity, 0);
    const totalAmount = cart.lines.reduce(
      (sum, l) => sum + parseFloat(l.cost.totalAmount.amount),
      0,
    );
    const currencyCode =
      cart.lines[0]?.cost.totalAmount.currencyCode ?? "USD";
    cart.cost = {
      subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalTaxAmount: { amount: "0.00", currencyCode },
    };
  }
}
