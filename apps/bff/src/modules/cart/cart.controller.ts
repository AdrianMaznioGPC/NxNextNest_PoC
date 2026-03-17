import type { Cart } from "@commerce/shared-types";
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CART_PORT, CartPort } from "../../ports/cart.port";
import { AddToCartDto, RemoveFromCartDto, UpdateCartDto } from "./cart.dto";

@Controller("cart")
export class CartController {
  constructor(@Inject(CART_PORT) private readonly cart: CartPort) {}

  @Get(":id")
  getCart(@Param("id") id: string): Promise<Cart | undefined> {
    return this.cart.getCart(id);
  }

  /**
   * Adds lines to a cart. If `cartId` is omitted, a new cart is created.
   * Returns the full cart including its ID so the caller can persist it.
   */
  @Post("lines")
  async addToCart(@Body() body: AddToCartDto): Promise<Cart> {
    let cartId = body.cartId;
    if (!cartId) {
      const newCart = await this.cart.createCart();
      cartId = newCart.id!;
    }
    return this.cart.addToCart(cartId, body.lines);
  }

  /**
   * Removes lines by merchandise ID. The BFF resolves merchandise IDs
   * to line IDs internally so the client doesn't need to.
   */
  @Post("remove")
  async removeFromCart(@Body() body: RemoveFromCartDto): Promise<Cart> {
    const cart = await this.cart.getCart(body.cartId);
    if (!cart) throw new NotFoundException("Cart not found");

    const lineIds = cart.lines
      .filter((line) => body.merchandiseIds.includes(line.merchandise.id))
      .map((line) => line.id!)
      .filter(Boolean);

    if (!lineIds.length) return cart;
    return this.cart.removeFromCart(body.cartId, lineIds);
  }

  /**
   * Updates line quantities by merchandise ID. Handles:
   * - quantity 0 → removes the line
   * - merchandise not in cart + quantity > 0 → adds it
   * - merchandise in cart + quantity > 0 → updates it
   */
  @Patch("lines")
  async updateCart(@Body() body: UpdateCartDto): Promise<Cart> {
    const cart = await this.cart.getCart(body.cartId);
    if (!cart) throw new NotFoundException("Cart not found");

    const toRemove: string[] = [];
    const toUpdate: { id: string; merchandiseId: string; quantity: number }[] =
      [];
    const toAdd: { merchandiseId: string; quantity: number }[] = [];

    for (const line of body.lines) {
      const existing = cart.lines.find(
        (l) => l.merchandise.id === line.merchandiseId,
      );

      if (existing?.id && line.quantity === 0) {
        toRemove.push(existing.id);
      } else if (existing?.id && line.quantity > 0) {
        toUpdate.push({
          id: existing.id,
          merchandiseId: line.merchandiseId,
          quantity: line.quantity,
        });
      } else if (!existing && line.quantity > 0) {
        toAdd.push({
          merchandiseId: line.merchandiseId,
          quantity: line.quantity,
        });
      }
    }

    let result = cart;
    if (toRemove.length) {
      result = await this.cart.removeFromCart(body.cartId, toRemove);
    }
    if (toUpdate.length) {
      result = await this.cart.updateCart(body.cartId, toUpdate);
    }
    if (toAdd.length) {
      result = await this.cart.addToCart(body.cartId, toAdd);
    }
    return result;
  }
}
