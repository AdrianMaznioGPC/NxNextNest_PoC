import type { Cart } from "@commerce/shared-types";
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CART_PORT, CartPort } from "../../ports/cart.port";
import { AddToCartDto, RemoveFromCartDto, UpdateCartDto } from "./cart.dto";

@Controller("cart")
export class CartController {
  constructor(@Inject(CART_PORT) private readonly cart: CartPort) {}

  @Post()
  createCart(): Promise<Cart> {
    return this.cart.createCart();
  }

  @Get(":id")
  getCart(@Param("id") id: string): Promise<Cart | undefined> {
    return this.cart.getCart(id);
  }

  @Post(":id/lines")
  addToCart(
    @Param("id") id: string,
    @Body() body: AddToCartDto,
  ): Promise<Cart> {
    return this.cart.addToCart(id, body.lines);
  }

  @Delete(":id/lines")
  removeFromCart(
    @Param("id") id: string,
    @Body() body: RemoveFromCartDto,
  ): Promise<Cart> {
    return this.cart.removeFromCart(id, body.lineIds);
  }

  @Patch(":id/lines")
  updateCart(
    @Param("id") id: string,
    @Body() body: UpdateCartDto,
  ): Promise<Cart> {
    return this.cart.updateCart(id, body.lines);
  }
}
