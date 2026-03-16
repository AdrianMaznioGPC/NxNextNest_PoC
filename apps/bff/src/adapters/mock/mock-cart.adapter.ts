import type { Cart, CartItem } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { CartPort } from "../../ports/cart.port";
import { PRICING_PORT, type PricingPort } from "../../ports/pricing.port";
import { PRODUCT_PORT, type ProductPort } from "../../ports/product.port";
import { StoreContext } from "../../store";
import { createEmptyCart } from "./data/cart-data";

@Injectable()
export class MockCartAdapter implements CartPort {
  private carts = new Map<string, Cart>();

  constructor(
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
    @Inject(PRICING_PORT) private readonly pricing: PricingPort,
    private readonly storeCtx: StoreContext,
  ) {}

  async createCart(): Promise<Cart> {
    const cart = createEmptyCart(this.storeCtx.currency);
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
        const allBase = await this.products.getProducts({});
        const match = allBase
          .flatMap((p) => p.variants.map((v) => ({ variant: v, product: p })))
          .find((pv) => pv.variant.id === line.merchandiseId);

        if (match) {
          const pricingData = await this.pricing.getPricing(match.product.id);
          const price = pricingData?.variantPrices.get(match.variant.id) ?? {
            amount: "0.00",
            currencyCode: this.storeCtx.currency,
          };
          const newItem: CartItem = {
            id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            quantity: line.quantity,
            cost: {
              totalAmount: {
                amount: (parseFloat(price.amount) * line.quantity).toFixed(2),
                currencyCode: price.currencyCode,
              },
            },
            merchandise: {
              id: match.variant.id,
              title: match.variant.title,
              selectedOptions: match.variant.selectedOptions,
              product: {
                id: match.product.id,
                handle: match.product.handle,
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
        existing.cost.totalAmount.amount = (unitPrice * line.quantity).toFixed(
          2,
        );
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
      cart.lines[0]?.cost.totalAmount.currencyCode ?? this.storeCtx.currency;
    cart.cost = {
      subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalAmount: { amount: totalAmount.toFixed(2), currencyCode },
      totalTaxAmount: { amount: "0.00", currencyCode },
    };
  }
}
