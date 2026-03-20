import type { CheckoutConfig, OrderConfirmation } from "@commerce/shared-types";
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import type { CheckoutPort } from "../../ports/checkout.port";
import { CHECKOUT_PORT } from "../../ports/checkout.port";
import type { OrderPort } from "../../ports/order.port";
import { ORDER_PORT } from "../../ports/order.port";
import { PlaceOrderDto } from "./checkout.dto";

@Controller("checkout")
export class CheckoutController {
  constructor(
    @Inject(CHECKOUT_PORT) private readonly checkout: CheckoutPort,
    @Inject(ORDER_PORT) private readonly order: OrderPort,
  ) {}

  @Get("config")
  getConfig(@Query("storeKey") storeKey?: string): Promise<CheckoutConfig> {
    return this.checkout.getCheckoutConfig(storeKey);
  }

  @Post("orders")
  placeOrder(@Body() body: PlaceOrderDto): Promise<OrderConfirmation> {
    return this.order.placeOrder(body);
  }

  @Get("orders/:orderId")
  async getOrder(
    @Param("orderId") orderId: string,
  ): Promise<OrderConfirmation> {
    const order = await this.order.getOrder(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    return order;
  }
}
