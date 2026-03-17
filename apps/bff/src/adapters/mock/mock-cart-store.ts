import type { Cart } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";

/**
 * Singleton in-memory cart store.
 * Separated from the request-scoped MockCartAdapter so that cart state
 * survives across requests.
 */
@Injectable()
export class MockCartStore {
  private readonly carts = new Map<string, Cart>();

  get(cartId: string): Cart | undefined {
    return this.carts.get(cartId);
  }

  set(cartId: string, cart: Cart): void {
    this.carts.set(cartId, cart);
  }
}
