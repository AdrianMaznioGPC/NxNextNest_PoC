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

@Controller("cart")
export class CartController {
  constructor(@Inject(CART_PORT) private readonly cart: CartPort) {}

  @Post()
  createCart() {
    return this.cart.createCart();
  }

  @Get(":id")
  getCart(@Param("id") id: string) {
    return this.cart.getCart(id);
  }

  @Post(":id/lines")
  addToCart(
    @Param("id") id: string,
    @Body() body: { lines: { merchandiseId: string; quantity: number }[] },
  ) {
    return this.cart.addToCart(id, body.lines);
  }

  @Delete(":id/lines")
  removeFromCart(
    @Param("id") id: string,
    @Body() body: { lineIds: string[] },
  ) {
    return this.cart.removeFromCart(id, body.lineIds);
  }

  @Patch(":id/lines")
  updateCart(
    @Param("id") id: string,
    @Body()
    body: {
      lines: { id: string; merchandiseId: string; quantity: number }[];
    },
  ) {
    return this.cart.updateCart(id, body.lines);
  }
}
