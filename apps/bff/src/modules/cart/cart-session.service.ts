import { Inject, Injectable, Logger } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { CART_PORT, CartPort } from "../../ports/cart.port";
import {
  getCartCookieConfig,
  readCookie,
  serializeCartCookie,
  serializeExpiredCartCookie,
} from "./cart-cookie.config";

@Injectable()
export class CartSessionService {
  private readonly logger = new Logger(CartSessionService.name);
  private readonly cartCookie = getCartCookieConfig();

  constructor(@Inject(CART_PORT) private readonly cart: CartPort) {}

  readCartId(cookieHeader: string | undefined): string | undefined {
    return readCookie(cookieHeader, this.cartCookie.name);
  }

  setCartCookie(response: FastifyReply | undefined, cartId: string): void {
    response?.header(
      "Set-Cookie",
      serializeCartCookie(this.cartCookie, cartId),
    );
  }

  clearCartCookie(response?: FastifyReply): void {
    response?.header("Set-Cookie", serializeExpiredCartCookie(this.cartCookie));
  }

  async getOrCreateCartId(
    cookieHeader: string | undefined,
    response?: FastifyReply,
  ): Promise<{ cartId: string; cookieIssued: boolean; cartCreated: boolean }> {
    const existingCartId = this.readCartId(cookieHeader);
    if (existingCartId) {
      const existing = await this.cart.getCart(existingCartId);
      if (existing) {
        return {
          cartId: existingCartId,
          cookieIssued: false,
          cartCreated: false,
        };
      }
    }

    const created = await this.cart.createCart();
    if (!created.id) {
      throw new Error("Cart ID missing for created cart");
    }
    this.setCartCookie(response, created.id);
    return { cartId: created.id, cookieIssued: true, cartCreated: true };
  }

  logCartEvent(
    requestId: string,
    action: string,
    cartCookiePresent: boolean,
    cartCreated: boolean,
    cookieIssued: boolean,
  ): void {
    this.logger.log(
      JSON.stringify({
        requestId,
        action,
        cartCookiePresent,
        cartCreated,
        cookieIssued,
      }),
    );
  }
}
