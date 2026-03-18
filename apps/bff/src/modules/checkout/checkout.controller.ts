import type { CheckoutConfig, OrderConfirmation } from "@commerce/shared-types";
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  SetMetadata,
} from "@nestjs/common";
import { CHECKOUT_PORT, CheckoutPort } from "../../ports/checkout.port";
import { ORDER_PORT, type OrderPort } from "../../ports/order.port";
import { CACHE_ROUTE_KIND_KEY } from "../system/cache-policy.service";
import { LOAD_SHED_SCOPE_KEY } from "../system/load-shedding.config";
import { PlaceOrderDto } from "./checkout.dto";

@Controller("checkout")
@SetMetadata(LOAD_SHED_SCOPE_KEY, "checkout")
@SetMetadata(CACHE_ROUTE_KIND_KEY, "checkout")
export class CheckoutController {
  constructor(
    @Inject(CHECKOUT_PORT) private readonly checkout: CheckoutPort,
    @Inject(ORDER_PORT) private readonly order: OrderPort,
  ) {}

  @Get("config")
  getConfig(): Promise<CheckoutConfig> {
    return this.checkout.getCheckoutConfig();
  }

  @Post("orders")
  placeOrder(@Body() body: PlaceOrderDto): Promise<OrderConfirmation> {
    return this.order.placeOrder(body);
  }

  @Get("orders/:id")
  async getOrder(@Param("id") id: string): Promise<OrderConfirmation> {
    const order = await this.order.getOrder(id);
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }
}
